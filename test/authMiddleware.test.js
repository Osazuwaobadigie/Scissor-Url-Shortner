// tests/authMiddleware.test.js
const jwt = require('jsonwebtoken');
const { protect } = require('../src/middleware/authMiddleware');

const mockRequest = (headers) => ({ headers, });

const mockResponse = () => {
  const res = {
    status: jest.fn((code) => {
      res.statusCode = code;
      return res;
    }),
    json: jest.fn((data) => {
      res.data = data;
      return res;
    }),
  };
  return res;
};

const mockNext = jest.fn();

describe('Auth Middleware', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Replace jest.restoreMocks with jest.restoreAllMocks
  });

  it('should return 401 if no token is provided', () => {
    const req = mockRequest({});
    const res = mockResponse();
    protect(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token, authorization denied' });
    expect(res.statusCode).toBe(401);
    expect(res.data).toEqual({ message: 'No token, authorization denied' });
  });

  it('should return 401 if token is invalid', () => {
    const req = mockRequest({ Authorization: 'Bearer invalidtoken' });
    const res = mockResponse();
    const verifySpy = jest.spyOn(jwt, 'verify');
    verifySpy.mockImplementation(() => {
      throw new jwt.JsonWebTokenError('Token is not valid');
    });
    protect(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token is not valid' });
    expect(res.statusCode).toBe(401);
    expect(res.data).toEqual({ message: 'Token is not valid' });
  });

  it('should return 401 if token is expired', () => {
    const req = mockRequest({ Authorization: 'Bearer expiredtoken' });
    const res = mockResponse();
    const verifySpy = jest.spyOn(jwt, 'verify');
    verifySpy.mockImplementation(() => {
      throw new jwt.TokenExpiredError('Token has expired');
    });
    protect(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Token has expired' });
    expect(res.statusCode).toBe(401);
    expect(res.data).toEqual({ message: 'Token has expired' });
  });

  it('should call next if token is valid', () => {
    const req = mockRequest({ Authorization: 'Bearer validtoken' });
    const res = mockResponse();
    const verifySpy = jest.spyOn(jwt, 'verify');
    verifySpy.mockImplementation(() => ({ userId: '123', role: 'user' }));
    protect(req, res, mockNext);
    expect(mockNext).toHaveBeenCalled();
    expect(req.user).toEqual({ userId: '123', role: 'user' });
  });
});


