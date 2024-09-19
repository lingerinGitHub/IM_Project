-- 根据时间段返回数据

local chatid = KEYS[1];
local endDate = ARGV[1];
local startDate = ARGV[2];



-- 查询时间段内的数据
local timestamplist = redis.call('ZREVRANGEBYSCORE', chatid, endDate, startDate, 'WITHSCORES');

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

-- 返回查询列表
return results
