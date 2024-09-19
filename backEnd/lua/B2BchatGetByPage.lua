-- 实现分页查询获取pagesize条聊天记录


local B2BchatKey = KEYS[1]
local pagenum = ARGV[1] + 0 -- 转换为数字进行运算
local pagesize = ARGV[2] + 0 -- 转换为数字进行运算
local onlineMsgNum = ARGV[3] + 0 -- 在wss中获取的在线消息数，是分页查询的偏移量,默认为0

local timestamplist = redis.call('ZREVRANGE', B2BchatKey, (pagenum * pagesize + onlineMsgNum), ((pagenum + 1) * pagesize  + onlineMsgNum - 1),
    'WITHSCORES');-- 获取指定页码的聊天记录

-- return timestamplist

-- 初始化一个空字典来存储结果
local results = {}
local tempChat = 0
local count = 0 -- 计数器

for _, value in ipairs(timestamplist) do
    count = count + 1; -- 计数器加1

    while true do
        if count % 2 == 0 then
            table.insert(results, value) -- 将时间戳插入结果列表
            break;
        else
            tempChat = redis.call('GET', value) -- 返回聊天结果
            if tempChat == false then
                table.insert(results, 'nomore')
                break;
            end
            table.insert(results, tempChat)
            break;
        end
    end
end

return results
