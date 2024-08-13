// tests/authMiddleware.test.js
const jwt = require('jsonwebtoken');
const { protect } = require('../src/middleware/authMiddleware');

const mockRequest = (headers) => ({
  headers,
});

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('Auth Middleware', () => {
  it('should return 401 if no token is provided', () => {
    // ...
  });

  it('should return 401 if token is invalid', () => {
    const req = mockRequest({ Authorization: 'Bearer invalidtoken' });
    const res = mockResponse();
    jwt.verify = jest.fn(() => {
      throw new jwt.JsonWebTokenError('Token is not valid');
    });
    protect(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
  });

  it('should return 401 if token is expired', () => {
    const req = mockRequest({ Authorization: 'Bearer expiredtoken' });
    const res = mockResponse();
    jwt.verify = jest.fn(() => {
      throw new jwt.TokenExpiredError('Token has expired');
    });
    protect(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token has expired' });
  });

  it('should return 401 if no token is provided', () => {
  const req = mockRequest({});
  const res = mockResponse();
  protect(req, res, mockNext);
  expect(res.status).toHaveBeenCalledWith(401);
  expect(res.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
});


  it('should call next if token is valid', () => {
    const req = mockRequest({ Authorization: 'Bearer validtoken' });
    const res = mockResponse();
    jwt.verify = jest.fn(() => ({ userId: '123', role: 'user' }));
    protect(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toEqual({ userId: '123', role: 'user' });
  });
});


