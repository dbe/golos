const Handlebars = require('handlebars')

function formatQuantities(quantities, names) {
  let total = quantities.reduce((acc, q) => acc + q.quantity, 0).toFixed(2)
  ret = '' + total

  let byName = {}
  quantities.forEach(q => byName[q.name] = q.quantity)

  ret += "("

  for(let i = 0; i < names.length; i++) {
    let name = names[i]
    ret += `<span class="api-${name}">`

    let q = byName[name]
    if(q == undefined) {
      ret += "0"
    } else {
      ret += q.toFixed(2)
    }
    ret += '</span>'
    if(i != names.length - 1) {
      ret += ', '
    }
  }

  ret += ')'

  return new Handlebars.SafeString(ret)
}

function option(value, selected) {
  ret = `<option value="${value}" `
  if(value == selected) {
    ret += 'selected="selected"'
  }
  ret += `>${value}</option>`

  return new Handlebars.SafeString(ret)
}

module.exports = {
  formatQuantities,
  option
}
