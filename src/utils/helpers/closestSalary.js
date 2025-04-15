export function findClosestStartDates(objectsArray, targetStartDate, endRange) {
    objectsArray.sort((a, b) => new Date(a.startdate) - new Date(b.startdate));

    let closestObject = null;
    let closestDifference = Infinity;

    // Binary search for the closest start date
    let low = 0;
    let high = objectsArray.length - 1;
    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        const startDate = new Date(objectsArray[mid].startdate);
        const difference = Math.abs(startDate - targetStartDate);

        const endDate = objectsArray[mid].enddate ? new Date(objectsArray[mid].enddate) : null;
        const isEndDateWithinRange = endDate ? endDate <= endRange : true;

        if (isEndDateWithinRange) {
            if (difference < closestDifference) {
                closestObject = objectsArray[mid];
                closestDifference = difference;
            }
        }

        if (startDate < targetStartDate) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return closestObject;
}
