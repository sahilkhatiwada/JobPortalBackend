/**
 * Utility function to compare two MongoDB ObjectIds for equality.
 * 
 * @param {string|mongoose.Types.ObjectId} id1 - The first ObjectId to compare.
 * @param {string|mongoose.Types.ObjectId} id2 - The second ObjectId to compare.
 * @returns {boolean} - Returns `true` if the IDs are equal, otherwise `false`.
 */
export const checkMongoIdsEquality = (id1, id2) => {
    // Convert both IDs to strings and compare for equality
    const isEqual = String(id1) === String(id2);
  
    return isEqual;
  };
  