import { CALL_HISTORY_METHOD } from 'react-router-redux';
import MockAdapter from 'axios-mock-adapter';

import { getStore } from '../../fixtures/store';
import http from '../../common/http';
import { SUBMIT_ERROR, SUBMIT_SUCCESS } from '../actionTypes';
import { submitAuthor } from '../submissions';

const mockHttp = new MockAdapter(http);

describe('submissions - async action creator', () => {
  afterEach(() => {
    mockHttp.reset();
  });

  describe('submitAuthor', () => {
    it('creates SUBMIT_SUCCESS and pushes /submissions/success to history if successful', async done => {
      const submissionUrl = '/submissions/author';
      const data = { field: 'value' };
      mockHttp.onPost(submissionUrl, { data }).replyOnce(200, {});

      const expectedActions = [
        {
          type: SUBMIT_SUCCESS,
        },
        {
          type: CALL_HISTORY_METHOD,
          payload: { args: ['/submissions/success'], method: 'push' },
        },
      ];

      const store = getStore();
      await store.dispatch(submitAuthor(data));
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });

    it('creates SUBMIT_ERRROR if not successful', async done => {
      const submissionUrl = '/submissions/author';
      mockHttp.onPost(submissionUrl).replyOnce(400, { message: 'Error' });

      const expectedActions = [
        {
          type: SUBMIT_ERROR,
          payload: { message: 'Error' },
        },
      ];

      const store = getStore();
      await store.dispatch(submitAuthor({}));
      expect(store.getActions()).toEqual(expectedActions);
      done();
    });
  });
});
