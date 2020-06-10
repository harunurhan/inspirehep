import { fromJS } from 'immutable';

import {
  LITERATURE_ERROR,
  LITERATURE_REQUEST,
  LITERATURE_SUCCESS,
  LITERATURE_REFERENCES_ERROR,
  LITERATURE_REFERENCES_REQUEST,
  LITERATURE_REFERENCES_SUCCESS,
  LITERATURE_AUTHORS_ERROR,
  LITERATURE_AUTHORS_REQUEST,
  LITERATURE_AUTHORS_SUCCESS,
  CLEAR_STATE,
} from '../actions/actionTypes';
import {
  onRequest,
  onSuccess,
  onError,
  initialState as initialRecordState,
} from './recordsFactory';

export const initialState = fromJS({
  loadingReferences: false,
  errorReferences: null,
  references: [],
  totalReferences: 0,
  queryReferences: {
    page: 1,
    size: 25,
  },
  loadingAuthors: false,
  errorAuthors: null,
  authors: [],
  supervisors: [],
}).merge(initialRecordState);

const literatureReducer = (state = initialState, action) => {
  switch (action.type) {
    case CLEAR_STATE:
      return initialState;
    case LITERATURE_REQUEST:
      return onRequest(state);
    case LITERATURE_SUCCESS:
      return onSuccess(state, action);
    case LITERATURE_ERROR:
      return onError(state, action);
    case LITERATURE_REFERENCES_REQUEST:
      return state
        .set('loadingReferences', true)
        .set('queryReferences', fromJS(action.payload));
    case LITERATURE_REFERENCES_SUCCESS:
      return state
        .set('loadingReferences', false)
        .set('references', fromJS(action.payload.metadata.references))
        .set('errorReferences', initialState.get('errorReferences'))
        .set('totalReferences', action.payload.metadata.references_count);
    case LITERATURE_REFERENCES_ERROR:
      return state
        .set('loadingReferences', false)
        .set('errorReferences', fromJS(action.payload.error))
        .set('references', initialState.get('references'))
        .set('totalReferences', initialState.get('totalReferences'));
    case LITERATURE_AUTHORS_REQUEST:
      return state.set('loadingAuthors', true);
    case LITERATURE_AUTHORS_SUCCESS:
      return state
        .set('loadingAuthors', false)
        .set('authors', fromJS(action.payload.metadata.authors))
        .set('supervisors', fromJS(action.payload.metadata.supervisors))
        .set('errorAuthors', initialState.get('errorAuthors'));
    case LITERATURE_AUTHORS_ERROR:
      return state
        .set('loadingAuthors', false)
        .set('errorAuthors', fromJS(action.payload.error))
        .set('authors', initialState.get('authors'));
    default:
      return state;
  }
};

export default literatureReducer;
