local redis = require "redis-cli"
local red = redis:new()
red:set_timeout(1000)
local ok, err = red:connect("127.0.0.1", 6379)

red.call('key','*')
-- if not ok then
--         ngx.say("failed to connect: ", err)
--         return
-- end
--密码和选择的桶
-- red:auth(password)
-- red:select(18)
-- ngx.say("set result: ", ok)
