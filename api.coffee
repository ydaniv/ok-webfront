http = require 'http'
_ = require 'underscore'
log = console.log

RESOURCES = ['member','party', 'bill']

options =
host: "oknesset.uumpa.com"
port: 80

exports.get = get = (path = '', member = '', format = 'json', fn) ->
  if format is 'json'
    if _(RESOURCES).include path
      o = _.extend options, {path: "/#{path}/#{member}/"}

      log "Sending Request: #{o.host}#{o.path}"

    # GET Request
      http.get(o, (res) ->
          log "Response Received: #{res.statusCode}"
          fn(new Error("Error - Status Code: #{res.statusCode}")) unless res.statusCode is 200

          data = ''
          res.on 'data', (chunk) ->
            data += chunk.toString 'UTF-8'
          res.on 'end', ->
            # All chunks received,
            # parse to json
            data = JSON.parse data
            try
              fn null, data
            catch error
              fn(error)
      ).on 'error', (e) ->
        log e.message
    else fn(new Error('Undefined Resource'))