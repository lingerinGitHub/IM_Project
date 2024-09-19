-- 变量userid sessionid创建哈希
local sessionid = KEYS[1] -- sessionid
local userid = KEYS[2] -- userid
local initialTime = KEYS[3] -- 记录开始的时间

local influence = redis.call('hset',  sessionid, 'userid', userid, 'start', initialTime, 'count', 0)

-- 设置过期时间
redis.call('expire', sessionid, 86400) -- 1天
-- 判断是否创建成功
if influence == 0 then
    return "false"
else
    return "true"
end
