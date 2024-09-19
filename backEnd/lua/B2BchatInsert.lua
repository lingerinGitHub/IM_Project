-- 向redis插入1条聊天记录(用户对用户)
-- 1. key: B2Bchat:userid1:userid2
-- 2. score: 时间戳
-- 3. value: 聊天记录
-- 4. 过期时间: 7天
-- 5. 返回值: 插入成功返回'success'，插入失败返回'fail'
-- 6. 参数: B2BchatKey, currentTime, chatRecord
-- 7. 返回值: 插入成功返回'success'，插入失败返回'fail'

-- 使用有序集合保存聊天id，将聊天id作为哈希键，聊天记录作为哈希值

local B2BchatKey = KEYS[1]
local currentTime = KEYS[2] -- 同时作为有序集合的score
local timeGap = ARGV[1] -- 1970年至今毫秒数,作为有序集合的成员,避免撞车
local chatInfo = ARGV[2] -- {fromId,toId,message,timestamp}
-- local chatId = timeGap -- k-v的key

local affectRow = redis.call('zadd', B2BchatKey, currentTime, timeGap)
if affectRow ~= 1 then
    return 'fail'
else
    redis.call('expire', B2BchatKey, 604800) -- 设置过期时间为7天
end

redis.call('set', timeGap, chatInfo)
affectRow = redis.call('expire', timeGap, 604800) -- 设置过期时间为7天

if affectRow == 1 then
    return 'success'
else
    return 'fail'
end

