import superagent from 'superagent';

import { REQUEST_RESULTS_RECEIVE } from '../actions';
import { getMethod, getCompleteQueryUrl, getBodyParams } from '../request/selectors';
import { getSelectedApi, getSelectedVersion } from '../ui/selectors';
import { get } from '../../api';

const receiveResults = (version, apiName, method, path, status, results) => {
  return {
    type: REQUEST_RESULTS_RECEIVE,
    payload: { version, apiName, method, path, status, results }
  };
};

export const request = () => (dispatch, getState) => {
  const state = getState();
  const apiName = getSelectedApi(state);
  const version = getSelectedVersion(state);
  const method = getMethod(state);
  const path = getCompleteQueryUrl(state);
  const api = get(apiName);
  const body = getBodyParams(state);

  superagent(method, `${api.baseUrl}${version}${path}`)
    .send(body)
    .set('accept', 'application/json')
    .then(res => {
      dispatch(receiveResults(version, apiName, method, path, res.status, res.body));
    });
}