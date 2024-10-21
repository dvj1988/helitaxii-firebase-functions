type FDTLDateThreshold = {
  thresholdDate: Date;
  value: number; // or any other type based on your needs
};

// Sample Data Structure
class FDTLDateThresholdStore {
  private thresholds: FDTLDateThreshold[];

  constructor() {
    this.thresholds = [];
  }

  getThresholds(): FDTLDateThreshold[] {
    return this.thresholds;
  }

  // Add a threshold with a specific date
  addThreshold(thresholdDate: Date, value: number): void {
    this.thresholds.push({ thresholdDate, value });
    // Ensure the thresholds are sorted in ascending order based on the date
    this.thresholds.sort(
      (a, b) => a.thresholdDate.getTime() - b.thresholdDate.getTime()
    );
  }

  // Retrieve the value based on input date
  getValueForDate(inputDate: Date): number {
    // Use binary search or linear search to find the correct value
    let result: number = 75; // Default value

    for (const threshold of this.thresholds) {
      if (inputDate >= threshold.thresholdDate) {
        result = threshold.value;
      } else {
        break;
      }
    }

    return result;
  }
}

// Example usage
const store = new FDTLDateThresholdStore();

// Adding some thresholds
store.addThreshold(new Date("1970-01-01T00:00:00.000Z"), 75);
store.addThreshold(new Date("2024-07-31T18:30:00.000Z"), 60);

export default store;
