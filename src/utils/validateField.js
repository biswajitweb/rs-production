export const validateField = (name, value) => {
  switch (name) {
    case "email": {
      if (!value.trim()) return "Please enter your email address";
      if (!/^\S+@\S+\.\S+$/.test(value))
        return "Please enter a valid email address.";
      return "";
    }
    case "mobile": {
      if (!trimmedValue) {
        return "Please enter your mobile number.";
      }

      // Only 10 digit mobile number
      if (!/^[6-9]\d{9}$/.test(trimmedValue)) {
        return "Please enter a valid 10-digit mobile number.";
      }

      return "";
    }
    case "password": {
      if (!value.trim()) return "Please enter your password.";
      return "";
    }

    default:
      return "";
  }
};