import expect from 'expect';
import reducer from '../../src/reducers';
import * as types from '../../src/actions/actionTypes';

describe('user reducer', () => {
  it('should return the initial state', () => {
    const nextstate = reducer(undefined, {});
    expect(nextstate.auth).toEqual({
      isAuthenticated: false,
      error: '',
    });
  });
  it('should handle AUTH_SUCCESS', () => {
    const action = {
      type: types.AUTH_SUCCESS,
    };
    const nextstate = reducer(undefined, action);
    expect(nextstate.auth).toEqual(
      {
        isAuthenticated: true,
        error: '',
      }
    );
  });
  it('should handle LOGOUT', () => {
    const action = {
      type: types.LOGOUT,
    };
    const nextstate = reducer(undefined, action);
    expect(nextstate.auth).toEqual(
      {
        isAuthenticated: false,
        error: '',
      }
    );
  });
});
