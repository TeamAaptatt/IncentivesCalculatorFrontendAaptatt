export const generateFiscalYearOptions = () => {
    const currentYear = new Date().getFullYear();
    const fiscalYearStart = new Date(currentYear, 3 , 1); // April is month 3 (0-based index)
    const nextYear = currentYear + 1;
    const fiscalYearEnd = new Date(nextYear, 2, 31); // March 31 of the next year

    const options = [   {
        label: `${currentYear - 1}-${currentYear}`,
        value: `${fiscalYearStart.getFullYear() - 1}-04-01T00:00:00.000Z,${fiscalYearEnd.getFullYear() - 1}-03-31T00:00:00.000Z`,
      }];
    options.push(
        {
            label: `${currentYear}-${nextYear}`,
            value: `${fiscalYearStart.getFullYear()}-04-01T00:00:00.000Z,${fiscalYearEnd.getFullYear()}-03-31T00:00:00.000Z`,
          }
     );
    // Add more options if needed

    return options;
  };
