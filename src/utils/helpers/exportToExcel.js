
export const exportToExcel = (data) => {
    const csvContent = "data:text/csv;charset=utf-8," + convertToCSV(data);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "placements.csv");
    document.body.appendChild(link);
    link.click();
  };
  
//   const convertToCSV = (data) => {
//     const header = Object.keys(data[0]).join(",");
//     const rows = data.map((row) => Object.values(row).join(","));
//     return [header, ...rows].join("\n");
//   };
  

export const convertToCSV = (data) => {
    const header = Object.keys(data[0]).join(",");
  
    const rows = data.map((row) => {
      const values = Object.keys(row).map((key) => {
        if (typeof row[key] === "object" && row[key] !== null) {
          return row[key].name;
        }
        return row[key];
      });
      return values.join(",");
    });
  
    return [header, ...rows].join("\n");

  };
  


  export const exportToExcel2 = (data, tablehead) => {
    const csvContent = "data:text/csv;charset=utf-8," + convertToCSV2(data, tablehead);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ownership.csv");
    document.body.appendChild(link);
    link.click();
  };
  
  export const convertToCSV2 = (data, tablehead) => {
    const header = tablehead.join(","); // Use the provided tablehead for header names
  
    const rows = data.map((row) => {
      const values = tablehead.map((key) => {
        if (typeof row[key] === "object" && row[key] !== null) {
          return row[key].name;
        }
        return row[key];
      });
      return values.join(",");
    });
  
    return [header, ...rows].join("\n");
  };
  