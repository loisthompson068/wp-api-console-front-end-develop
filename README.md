# WordPress.com API Console v3

This is a WIP rewrite in React of [the WordPress.com API Console](https://github.com/Automattic/rest-api-console2).



## Getting Started Locally

To setup the environment on your local system with WordPress.com APIs:

1. Clone the repository `git clone https://github.com/Automattic/wp-api-console.git`.

2. Install dependencies `npm install`.

3. Open [WordPress.com Developer Resources](https://developer.wordpress.com/apps/)

4. Create New Application: fill the form. Under "Redirect URI" and "Javascript Origins" specify `http://localhost:3000` (or where your local app will run). After creation keep the OAuth Information details at hand.

5. Copy `src/config.sample.json` to `src/config.json` and fill "client_id" and "redirect_uri" with the values from the app created above.

6. Run the dev server `npm start`. The app will start at [http://localhost:3000](http://localhost:3000).

7. Click on the key to authenticate.

For more details, see below or check out the [technical documentation](./DOC.md).



## Configuration

### Using with WordPress.com APIs

To use with WordPress.com, visit [WordPress.com Developer Resources](https://developer.wordpress.com/apps/) and create an application.

Copy `src/config.sample.json` to `src/config.json` and use your WordPress.com Client ID and Redirect URI for the values.

Make sure you add your host to the Javascript Origins / CORS whitelist in the Application's settings.

```json
{
  "wordpress.com": {
    "clientID": "33333",
    "redirectUrl": "http://localhost:3000"
  }
}
```

### Using with your self-hosted WordPress site

You can also use this console with your WordPress.org installation but make
sure to install the
[WP REST API - OAuth 1.0a Server](https://oauth1.wp-api.org/)
first, create an app (in the Users → Applications screen), and then edit the
`src/config.json` like this:

```javascript
{
  "wordpress.org": [
    {
      "name": "Dev",                         // Name to display on the API selector
      "url": "http://wordpress.dev",         // Base URL of your WordPress website
      "clientKey": "PwQXbJdBYrXq",           // Client (public) key of your application
      "secretKey": "XB9oidFfxr3g...",        // Secret key of your application
      "callbackUrl": "http://localhost:3000" // Callback URL where you are running this console
    }
  ]
}
```

Note that your `callbackUrl` must match the configured value for the application.
If you are having an error like "Callback URL is invalid", try putting a trailing
slash at the end of your callback URL
([details](https://github.com/WP-API/example-client/issues/5)).

You can also install the
[Application Passwords plugin](https://github.com/georgestephanis/application-passwords/)
and use basic authentication to communicate with your site.  Make sure that
your site is running over HTTPS, otherwise this is insecure.  Here are the
config settings for basic auth:

```javascript
{
  "wordpress.org": [
    {
      "name": "Dev (basic)",                 // Name to display on the API selector
      "url": "https://wordpress.dev",        // Base URL of your WordPress website
      "authType": "basic",
      "authHeader": "Basic bWU6bXlwYSBzc3dvIHJk"
    }
  ]
}
```

You can generate the base64-encoded portion of the `authHeader` as follows, using your WP username and your application password (this is the password generated by the plugin, NOT your WP password for your site):

```sh
$ echo -n 'mywpusername:mypa sswo rd' | base64
bWU6bXlwYSBzc3dvIHJk
```


## Building a Static Package

To create a static package you can use anywhere (e.g. Github pages): `npm run build`

The static site is located in `build`


## Deploying

If you want to quickly deploy the console to [Surge](https://surge.sh), just run `npm run deploy`.


## License

All source code is licensed under [GNU General Public License v2 (or later)](./LICENSE).
