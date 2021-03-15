// Object "Validator"
const Validator = (options) => {
  const getParentElement = (element, selector) => {
    while (element.parentElement) {
      if (element.parentElement.matches(selector)) {
        return element.parentElement;
      }
      element = element.parentElement;
    }
  };

  let selectorRules = {};

  // function "validate"
  const validate = (inputElement, rule) => {
    const parentElement = getParentElement(
      inputElement,
      options.formGroupSelector
    );
    const formMessage = parentElement.querySelector(options.errorSelector);
    let errorMessage;

    // get all the rules of one selector
    let rules = selectorRules[rule.selector];

    // loop over the rules array and validate each rule. (if there is an error, break out of the loop)
    for (let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputElement.value);
      if (errorMessage) break;
    }

    if (errorMessage) {
      parentElement.classList.add("invalid");
      formMessage.innerText = errorMessage;
    } else {
      parentElement.classList.remove("invalid");
      formMessage.innerText = "";
    }

    return !errorMessage;
  };

  // function "handleInput"
  const handleInput = (inputElement) => {
    const parentElement = getParentElement(
      inputElement,
      options.formGroupSelector
    );
    const formMessage = parentElement.querySelector(options.errorSelector);
    inputElement.parentElement.classList.remove("invalid");
    formMessage.innerText = "";
  };

  // get form element needed validate
  const formElement = document.querySelector(options.form);
  if (formElement) {
    // When submit form
    formElement.onsubmit = function (event) {
      event.preventDefault();
      let isFormValid = true;

      // loop over and validate each rule.
      options.rules.forEach(function (rule) {
        let inputElement = formElement.querySelector(rule.selector);
        validate(inputElement, rule);
        let isValid = validate(inputElement, rule);
        if (!isValid) {
          isFormValid = false;
        }
      });

      if (isFormValid) {
        // When submit with javascript
        if (typeof options.onSubmit === "function") {
          let validInputs = formElement.querySelectorAll(
            "[name]:not([disabled])"
          );
          let formValues = [...validInputs].reduce((values, input) => {
            values[input.name] = input.value;
            return values;
          }, {});
          options.onSubmit(formValues);
          setTimeout(function wait() {
            window.location.replace(`./countdown.html`);
          }, 500);
        } else {
          // when default submitting
          formElement.submit();
        }
      }
    };

    // Loop over and validate each rule. Also handle event blur, input
    options.rules.forEach((rule) => {
      // get rules for each input field by pushing into an array
      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      const inputElement = formElement.querySelector(rule.selector);
      if (inputElement) {
        // Check input when user blurs outside.
        inputElement.onblur = () => {
          validate(inputElement, rule);
          // Check input when user types
          inputElement.oninput = () => {
            handleInput(inputElement);
          };
        };
      }
    });
  }
};

Validator.isRequired = (selector, message = "Please fill in this field.") => {
  return {
    selector: selector,
    test: (value) => {
      return value.trim() ? undefined : message;
    },
  };
};

Validator.isEmail = (selector, message = "Please enter a valid email.") => {
  return {
    selector: selector,
    test: (value) => {
      const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
      return regex.test(value) ? undefined : message;
    },
  };
};

Validator.isPhone = (
  selector,
  message = "Please enter a valid phone number"
) => {
  return {
    selector: selector,
    test: (value) => {
      const regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
      return regex.test(value) ? undefined : message;
    },
  };
};

Validator.isAddress = (selector, message = "Please enter a valid address.") => {
  return {
    selector: selector,
    test: (value) => {
      const regex = /^\d{1,6}\040([A-Z]{1}[a-z]{1,}\040[A-Z]{1}[a-z]{1,})$|^\d{1,6}\040([A-Z]{1}[a-z]{1,}\040[A-Z]{1}[a-z]{1,}\040[A-Z]{1}[a-z]{1,})$|^\d{1,6}\040([A-Z]{1}[a-z]{1,}\040[A-Z]{1}[a-z]{1,}\040[A-Z]{1}[a-z]{1,}\040[A-Z]{1}[a-z]{1,})$/;
      return regex.test(value) ? undefined : message;
    },
  };
};

Validator.isCity = (selector, message = "Please enter a valid city.") => {
  return {
    selector: selector,
    test: (value) => {
      const regex = /^(?:[A-Za-z]{2,}(?:(\.\s|'s\s|\s?-\s?|\s)?(?=[A-Za-z]+))){1,2}(?:[A-Za-z]+)?$/;
      return regex.test(value) ? undefined : message;
    },
  };
};

Validator.isState = (selector, message = "Please enter a valid state.") => {
  return {
    selector: selector,
    test: (value) => {
      const regex = /^(?:Ala(?:(?:bam|sk)a)|American Samoa|Arizona|Arkansas|(?:^(?!Baja )California)|Colorado|Connecticut|Delaware|District of Columbia|Florida|Georgia|Guam|Hawaii|Idaho|Illinois|Indiana|Iowa|Kansas|Kentucky|Louisiana|Maine|Maryland|Massachusetts|Michigan|Minnesota|Miss(?:(?:issipp|our)i)|Montana|Nebraska|Nevada|New (?:Hampshire|Jersey|Mexico|York)|North (?:(?:Carolin|Dakot)a)|Ohio|Oklahoma|Oregon|Pennsylvania|Puerto Rico|Rhode Island|South (?:(?:Carolin|Dakot)a)|Tennessee|Texas|Utah|Vermont|Virgin(?:ia| Island(s?))|Washington|West Virginia|Wisconsin|Wyoming|A[KLRSZ]|C[AOT]|D[CE]|FL|G[AU]|HI|I[ADLN]|K[SY]|LA|M[ADEINOST]|N[CDEHJMVY]|O[HKR]|P[AR]|RI|S[CD]|T[NX]|UT|V[AIT]|W[AIVY])$/;
      return regex.test(value) ? undefined : message;
    },
  };
};

Validator.isZipCode = (
  selector,
  message = "Please enter a valid ZIP Code."
) => {
  return {
    selector: selector,
    test: (value) => {
      const regex = /^\d{5}(-\d{4})?$/;
      return regex.test(value) ? undefined : message;
    },
  };
};

Validator.minLength = (selector, min) => {
  return {
    selector: selector,
    test: (value) => {
      return value.length >= min
        ? undefined
        : `Please enter at least ${min} characters. `;
    },
  };
};

Validator.isConfirmed = (
  selector,
  getConfirmedValue,
  message = "Your input does not match."
) => {
  return {
    selector: selector,
    test: (value) => {
      return value === getConfirmedValue() ? undefined : message;
    },
  };
};
