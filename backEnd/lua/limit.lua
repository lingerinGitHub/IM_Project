-- 编写redis流量控制脚本,session过期时间1天
-- redis结构 Hset sessionid userid:userid initialTime:time count:0
--           EXPIRE sessionid 86400 

local sessionid = KEYS[1] -- 哈希表名
local currentTime = KEYS[2] -- 以分钟为计时每分钟允许访问100次

-- 检验sessionid是否存在
local userid = redis.call('HGET', sessionid, 'userid')

if userid == false then
    return 'invalid'
end

-- 检查是否需要重置记录开始时间startTime以及count
local initialTime = redis.call('Hget', sessionid, 'initialTime')

if currentTime < initialTime or (currentTime - initialTime) >= 1 then

    redis.call('Hset',  sessionid, 'initialTime', currentTime)
    redis.call('Hset', sessionid, 'count', 0) -- 重置访问次数为1
    
end

-- 判断sessionid是否需要续时
local ttl = redis.call('TTL', sessionid)

if ttl < 57600 then
    redis.call('EXPIRE', sessionid, '86400')
end

-- 将访问数量+1并返回访问数量
local count = redis.call('HINCRBYFLOAT', sessionid, 'count' , 1)

return count
