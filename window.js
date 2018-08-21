$(() => {
  const crypto = require('crypto')
  const rot = require('rot')

  $('#text-input').bind('input propertychange', function() {
    const text = this.value

    let out = "";
    for (let j = 1; j <= 26; j++) {
      out = out + j + ' ' + rot(text, j) + '\n';
    }
    $('#rot-output').text(out);

    const sha1 = crypto.createHash('sha1').update(text, 'utf8').digest('hex')
    $('#sha1-output').text(sha1)

    const sha256 = crypto.createHash('sha256').update(text, 'utf8').digest('hex')
    $('#sha256-output').text(sha256)

    const sha512 = crypto.createHash('sha512').update(text, 'utf8').digest('hex')
    $('#sha512-output').text(sha512)
  })

  $('#text-input').focus() // focus input box
})
