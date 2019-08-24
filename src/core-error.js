export default class CoreError extends Error {
  constructor(kind, message) {
    super(message);
    this.name = kind.description.replace(/.*\./, '');
    this.kind = kind;
  }

  static Kind = Object.freeze({
    DatabaseConnectionFailure: Symbol(
      'CoreError.Kind.DatabaseConnectionFailure'
    ),
    DatabaseNotSet: Symbol('CoreError.Kind.DatabaseNotSet'),
    DatabaseOperationFailure: Symbol('CoreError.Kind.DatabaseOperationFailure'),
    NotFound: Symbol('CoreError.Kind.NotFound')
  });
}
