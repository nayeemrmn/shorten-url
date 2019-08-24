import CoreError from '../core-error.js';

export default coreErrorKind => {
  switch (coreErrorKind) {
    case CoreError.Kind.DatabaseConnectionFailure:
      return 503;
    case CoreError.Kind.DatabaseNotSet:
      return 503;
    case CoreError.Kind.DatabaseOperationFailure:
      return 503;
    case CoreError.Kind.NotFound:
      return 404;
    default:
      return 500;
  }
};
