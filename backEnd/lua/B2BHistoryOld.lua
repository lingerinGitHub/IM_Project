-- 1.	首先zrevange获取最新20条zset信息
-- 2.	将value与前端返回的timeStamp进行比对，如果前端时间<value则放入列表并放入聊天信息，如果这20条信息内有时间戳是<前端时间的则在数组最后返回all，表示客户端聊天记录与服务器已同步
-- 3.	获取k-v的时候还需要检查k-v是否存在，如为nil则同样表示客户端聊天记录与服务器已同步

local B2BchatKey = KEYS[1]
local pagenum = ARGV[1] + 0  -- 转换为数字进行运算
local pagesize = ARGV[2] + 0 -- 转换为数字进行运算
local timeStamp = ARGV[3] + 0

local timestamplist = redis.call('ZREVRANGE', B2BchatKey, (pagenum * pagesize), ((pagenum + 1) * pagesize - 1),
    'WITHSCORES'); -- 获取指定页码的聊天记录


-- 初始化一个空字典来存储结果
local results = {}
local tempChat = 0
local count = 1            -- 计数器
local returnSignal = false -- 提示已无更多历史消息，需返回
local tempChatStamp = ''   -- 当前聊天信息时间戳

for index, value in ipairs(timestamplist) do
    count = count + 1
    -- 这个timeStamp是1970至今微秒数，越小越旧,value > timeStamp说明当前记录比浏览器时间戳新,需要发送给前端
    if index % 2 == 1 and (value + 0) > timeStamp then
        tempChat = redis.call('GET', value) -- 返回当前聊天记录
        if tempChat == false or returnSignal == true then
            -- 如果出现这种情况需要清空hset中剩余的key
            returnSignal = true
            redis.call('ZREM', B2BchatKey, value)
        else
            -- 如果不为空则将消息插入results表
            tempChatStamp = timestamplist[count]
            table.insert(results, tempChat)
            table.insert(results, tempChatStamp)
        end
    end
end

if count / 2 < pagesize or returnSignal == true then
    table.insert(results, 'nomore');
end

return results
