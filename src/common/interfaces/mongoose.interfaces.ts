export interface IDeleteWriteOperationResultObject {
  //The raw result returned from MongoDB, field will vary depending on server version.
  result?: {
    //Is 1 if the command executed correctly.
    ok?: number;
    //The total count of documents deleted.
    n?: number;
  };
  //The connection object used for the operation.
  connection?: any;
  //The number of documents deleted.
  deletedCount?: number;
}
