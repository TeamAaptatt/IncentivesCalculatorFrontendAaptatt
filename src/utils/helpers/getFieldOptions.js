import { paymentStatusOptions, securityPeriodOptions } from "../../constants/placementTable";

export const getFieldOptions = (field, users, filteredUsers) => {
    switch (field) {
      case "cnadidateOwner":
      case "accountManager":
      case "accountHead":
      case "pandLhead":
        const usersToDisplay = field === "cnadidateOwner" ?
          users?.map((user) => ({
            label: `${user.name} (${user.cid})`,
            value: user._id,
          })) : filteredUsers?.map((user) => ({
            label: `${user.name} (${user.cid})`,
            value: user._id,
          }))
        return usersToDisplay;

      case "securityPeriod":
        return securityPeriodOptions.map((option) => ({
          label: option,
          value: option,
        }));
      case "paymentStatus":
        return paymentStatusOptions.map((option) => ({
          label: option,
          value: option,
        }));
      default:
        return [];
    }
  };