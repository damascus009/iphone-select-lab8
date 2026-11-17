// Lab 9: explicit educational rules, not proof an address/number exists.
export const REGEX_EMAIL = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/u;
export const REGEX_PHONE = /^\+380[0-9]{9}$/;
const length = value => Array.from(value).length;
export const validateName = value => {
  const n = length(value.trim());
  return n < 2 ? 'Введіть ім’я: щонайменше 2 символи.' : n > 80 ? 'Ім’я має містити не більше 80 символів.' : '';
};
export const validateEmail = value => {
  const email = value.trim();
  return email.length > 254 || !REGEX_EMAIL.test(email) ? 'Введіть email у форматі name@example.com.' : '';
};
// Do not trim or reformat a phone: the requirement explicitly forbids spaces.
export const validatePhone = value => REGEX_PHONE.test(value) ? '' : 'Введіть +380 і рівно 9 цифр без пробілів, дужок та дефісів.';
export const validateMessage = value => {
  const n = length(value.trim());
  return n < 10 ? 'Напишіть щонайменше 10 символів.' : n > 2000 ? 'Повідомлення має містити не більше 2000 символів.' : '';
};
export const validateAgreement = checked => checked ? '' : 'Підтвердьте ознайомлення з політикою конфіденційності.';
export const validators = {username:validateName,email:validateEmail,phone:validatePhone,message:validateMessage,agreement:validateAgreement};
