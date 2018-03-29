
// Credit to aldeed/simple-schema package

export default {
  // Emails with TLD
  Email: /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+(?:\.[A-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[A-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[A-z0-9]{2,}(?:[a-z0-9-]*[a-z0-9])?$/,
  Username: /^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$/
}
