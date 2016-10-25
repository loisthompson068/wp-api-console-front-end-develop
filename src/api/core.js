const namespaces = ['wp/v2', 'wpcom/v2'];

const guessEndpointDocumentation = (method, namespace, computedPath) => {
  // Try to guess some info about the endpoints
  let group = '';
  let groupPlural = '';
  let groupSingular = '';
  let description = '';

  let verbMatch = computedPath.match(/^(\/?sites\/[\$\w.]+)?\/([\w-]*)(\/|$)/);

  if (verbMatch) {
    group = verbMatch[2];
    switch (group) {
      case 'media':
        groupPlural = 'media items';
        break;
      case 'feedback':
        groupPlural = 'feedback posts';
        break;
      case 'types':
        groupPlural = 'post types';
        break;
      case 'statuses':
        groupPlural = 'post statuses';
        break;
      default:
        groupPlural = group;
        break;
    }

    if (group === 'statuses') {
      groupSingular = 'post status';
    } else if (group === 'sites' || computedPath === '/') {
      group = 'auto-discovery';
    } else {
      groupSingular = groupPlural.replace(/ies$/, 'y').replace(/s$/, '');
    }

    function getDescription() {
      if (group === 'auto-discovery') {
        if (computedPath === '/') {
          return 'List endpoints in the ' + namespace + ' namespace';
        } else {
          return 'List endpoints in the ' + namespace + ' namespace (site-specific)';
        }
      }

      if (namespace === 'wp/v2') {
        if (group === 'settings') {
          switch (method) {
            case 'GET':
              return 'Get site settings';
            default:
              return 'Edit site settings';
          }
        }

        if (/\/users\/me$/.test(computedPath)) {
          return 'Get the current user';
        }

        if (/\/revisions(\/|$)/.test(computedPath)) {
          groupPlural = 'revisions of a ' + groupSingular;
          groupSingular = 'revision of a ' + groupSingular;
        }

        if (/\$(id|status|taxonomy|type)$/.test(computedPath)) {
          switch (method) {
            case 'GET':
              return 'Get a ' + groupSingular;
            case 'POST':
            case 'PUT':
            case 'PATCH':
              return 'Edit a ' + groupSingular;
            case 'DELETE':
              return 'Delete a ' + groupSingular;
            default:
              return '';
          }
        } else {
          switch (method) {
            case 'GET':
              return 'List ' + groupPlural;
            case 'POST':
              return 'Create a ' + groupSingular;
            default:
              return '';
          }
        }
      }
    }

    description = getDescription() || '';
  }

  return {
    group: group,
    description: description,
  };
}

const parseEndpoints = data => {
  var endpoints = [];

  Object.keys(data.routes).forEach(url => {
    const route = data.routes[url];
    // Drop the /wp/v2
    const rawpath = url.substr(data.namespace.length + 1);
    route.endpoints.forEach(rawEndpoint => {
      rawEndpoint.methods.forEach(method => {
        // Parsing Query
        const query = {};
        Object.keys(rawEndpoint.args).forEach(key => {
          const arg = rawEndpoint.args[key];
          query[key] = {
            description: {
              view: arg.description
            }
          };
        });

        // Parsing path
        const path = {};
        const paramRegex = /\([^\(\)]*\)/g;
        const parameters = rawpath.match(paramRegex) || [];
        let pathLabel = rawpath;
        let pathFormat = rawpath;
        parameters.forEach(param => {
          const paramDetailsRegex = /[^<]*<([^>]*)>\[([^\]]*)\][^]*/;
          const explodedParameter = param.match(paramDetailsRegex);
          const paramName = '$' + explodedParameter[1];
          path[paramName] = {
            description: '',
            type: explodedParameter[2]
          };
          pathLabel = pathLabel.replace(param, paramName);
          pathFormat = pathFormat.replace(param, '%s');
        });

        const { group, description } = guessEndpointDocumentation(method, data.namespace, pathLabel);

        const endpoint = {
          path_format: pathFormat || '/',
          path_labeled: pathLabel || '/',
          request: {
            body: [],
            query,
            path
          },
          description,
          group,
          method
        };

        endpoints.push(endpoint);
      });
    });
  });

  return endpoints;
};

const baseUrl = 'https://public-api.wordpress.com/'
const api = {
  name: 'WP REST API',
  getDiscoveryUrl: version => baseUrl + version,
  loadVersions: () => new Promise(resolve => resolve({ versions: namespaces })),
  baseUrl,
  parseEndpoints
}

export default api;
