const router = require('koa-router')()
const { verifyTokenId, generateToken } = require('../utils/jwt_util.js')
const knex = require('../config/knex_config.js');
router.prefix('/friend')

//需要提前检测cookieid与查询用户id是否一致
router.post('/search', async function (ctx) {

    console.log('查询用户')

    console.log(ctx.request.body?.data)
    const data = ctx.request.body?.data

    if (data == undefined || data.friendname == undefined || data.userid == undefined) {
        ctx.status = 502
        return
    }

    try {

        const searchresult = await knex('users')
            .select('id', 'username', 'province', 'photo', 'city')
            .where({ 'username':data.friendname, 'is_delete': '0' })
            .then(result => {
                return result
            })
            .catch(error => {
                throw error
            })

        console.log(searchresult)

        ctx.body= {data:searchresult, status:200}
        ctx.status = 200

        return

    } catch {
        console.log('数据库返回异常')
        ctx.status = 502;
        return
    }
})

router.post('/add', async function (ctx, next) {

    console.log('添加好友')

    console.log(ctx.request.body?.data)
    const data = ctx.request.body?.data
    if (data == undefined) {
        ctx.status = 502
        return
    }

    // 第一个查询部分
    const query1 = knex('friendships as f')
        .select('status')
        .where({
            'f.user_id': data.userid,
            'f.friend_id': data.friendid,
        });

    // 第二个查询部分
    const query2 = knex('friendships as f')
        .select('status')
        .where({
            'f.user_id': data.friendid,
            'f.friend_id': data.userid,
        });



    // 使用union将两个查询合并,联合查询
    const ifAdded = await knex.union(knex.raw(query1.toString()), knex.raw(query2.toString()))
        .then(async (result) => {

            if (result.length == 0) {
                return false
            }

            return true
        })



    if (!ifAdded) {

        // //添加两条记录至数据库中
        try {
            const addResult = await knex('friendships')
                .insert(
                    [{ user_id: data.userid, friend_id: data.friendid, status: 'accepted' },
                    { user_id: data.friendid, friend_id: data.userid, status: 'pending' }]
                )
            console.log('好友添加成功')
        } catch {
            console.log('好友id并不在users中')
            ctx.body = JSON.stringify({ data: 'error', status: 502 })
            ctx.status = 502
            return
        }

        ctx.body = JSON.stringify({ data: '添加成功', status: 200 })
        ctx.status = 200
        return
    } else {
        ctx.body = JSON.stringify({ data: '好友已添加', status: 500 })
        ctx.status = 500
        return
    }

})


router.post('/status', async function (ctx) {

    console.log('获取好友状态列表')

    console.log(ctx.request.body?.data)
    const data = ctx.request.body?.data
    if (data == undefined) {
        console.log('data为空')
        ctx.status = 502
        return
    }

    // 第一个查询部分
    const query1 = knex('friendships as f')
        .select('user_id', 'friend_id', 'status', 'updated_at')
        .where({
            'f.user_id': data.userid,
        });

    // 第二个查询部分
    const query2 = knex('friendships as f')
        .select('user_id', 'friend_id', 'status', 'updated_at')
        .where({
            'f.friend_id': data.userid,
        });

    // 使用union将两个查询合并,联合查询
    let friendStatusClassification = {
        pendingList: [],
        waitingList: [],
        rejectedList: [],
        acceptedList: [],
        deletedList: [],
        beDeletedList: []
    }

    const statusUnion = await knex.union(knex.raw(query1.toString()), knex.raw(query2.toString()))
        .then(async (result) => {
            return result
        })
        .catch((error) => {
            console.log(error)
        })

    // 对好友关系进行判断
    friendStatusClassification = await friendStatusVerify(statusUnion, data)

    ctx.body = JSON.stringify({
        'status': 200,
        'data': { 'friendStatusClassification': friendStatusClassification },
    });
    ctx.status = 200;
})

router.post('/statusUpdate', async function (ctx) {

    console.log('更改好友关系')

    console.log(ctx.request.body?.data)
    const data = ctx.request.body?.data

    if (data == undefined || data.friendid == undefined || data.userid == undefined || !['accepted', 'rejected', 'deleted'].includes(data.status)
    ) {
        ctx.status = 502
        return
    }

    try {
        const result = await knex('friendships')
            .where({ 'user_id': data.userid, 'friend_id': data.friendid })
            .update({ 'status': data.status })
            .then(result => {
                if (result) {
                    return true
                }
            })

        if (result) {
            ctx.body= {data:'success', status:200}
            ctx.status = 200
            return
        }

        throw error;

    } catch {

        console.log('数据库返回异常')

        ctx.status = 502;
        return

    }
})


async function friendStatusVerify(friendStatusList, data) {

    result = friendStatusList

    let friendStatusClassification = {
        pendingList: [],
        waitingList: [],
        rejectedList: [],
        acceptedList: [],
        deletedList: [],
        beDeletedList: []
    }

    while (result.length) {

        var user = {
            id: data.userid,
            status: '',
            updated_at: ''
        }
        var friend = {
            id: '',
            status: '',
            updated_at: ''
        }

        if (result[0].user_id == data.userid) {

            friend.id = result[0].friend_id
            user.status = result[0].status
            user.updated_at = result[0].updated_at

        } else if (result[0].friend_id == data.userid) {

            friend.id = result[0].user_id
            friend.status = result[0].status
            friend.updated_at = result[0].updated_at

        }

        //删除第一个元素
        result.splice(0, 1)

        if (friend.status == '') {

            let index = result.findIndex(function (item) {
                return item.user_id == friend.id
            })

            if (index == -1) {
                continue
            }

            friend.status = result[index].status
            friend.updated_at = result[index].updated_at
            result.splice(index, 1)

        } else if (user.status == '') {

            let index = result.findIndex(function (item) {
                return item.friend_id == friend.id
            })

            if (index == -1) {
                continue
            }

            user.status = result[index].status
            user.updated_at = result[index].updated_at
            result.splice(index, 1)

        }

        let friendName = await knex.select('username').from('users').where({ 'id': friend.id })
            .then(result => {
                return result[0].username
            })
            .catch(error => {
                console.log(error)
            })

        //已为好友
        if (user.status == 'accepted' && friend.status == 'accepted') {

            friendStatusClassification.acceptedList.push({
                friendid: friend.id,
                friendName: friendName,
                updated_at: user.updated_at
            })

            // 等待用户回复
        } else if (user.status == 'pending' && friend.status == 'accepted') {

            friendStatusClassification.pendingList.push({
                friendid: friend.id,
                friendName: friendName,
                updated_at: user.updated_at
            })

            // 等待对方回复
        } else if (user.status == 'accepted' && friend.status == 'pending') {

            friendStatusClassification.waitingList.push({
                friendid: friend.id,
                friendName: friendName,
                updated_at: user.updated_at
            })

            // 已拒绝
        } else if (user.status == 'rejected' && friend.status == 'accepted') {

            friendStatusClassification.rejectedList.push({
                friendid: friend.id,
                friendName: friendName,
                updated_at: friend.updated_at
            })

            // 已删除
        } else if (user.status == 'deleted' && friend.status == 'accepted') {

            friendStatusClassification.deletedList.push({
                friendid: friend.id,
                friendName: friendName,
                updated_at: user.updated_at
            })

            // 被删除
        } else if (user.status == 'accepted' && friend.status == 'deleted') {

            friendStatusClassification.beDeletedList.push({
                friendid: friend.id,
                friendName: friendName,
                updated_at: friend.updated_at
            })

        }


    }

    // 时间降序排列
    for (let key in friendStatusClassification) {
        // 检查属性是否属于对象自身（而不是从原型链上继承的）  
        if (friendStatusClassification.hasOwnProperty(key)) {
            // console.log(key); // 输出属性名
            // console.log(friendStatusClassification[key]); // 输出属性值

            //数组排序
            friendStatusClassification[key].sort((a, b) => {
                // 将 updated_at 属性转换为 Date 对象以便比较  
                const dateA = new Date(a.updated_at);
                const dateB = new Date(b.updated_at);
                //降序
                return dateB - dateA;
            });
        }
    }

    // 将字段改成日期，时间
    for (let key in friendStatusClassification) {
        // 检查属性是否属于对象自身（而不是从原型链上继承的）  
        if (friendStatusClassification.hasOwnProperty(key)) {
            // console.log(key); // 输出属性名
            // console.log(friendStatusClassification[key]); // 输出属性值

            //数组排序
            friendStatusClassification[key] = friendStatusClassification[key].map((item) => {

                const year = String(item.updated_at.getFullYear());
                const month = String(item.updated_at.getMonth() + 1).padStart(2, '0'); // 月份从0开始，加1并补零  
                const day = String(item.updated_at.getDate()).padStart(2, '0'); // 补零  
                const hours = String(item.updated_at.getHours()).padStart(2, '0'); // 补零  
                const minutes = String(item.updated_at.getMinutes()).padStart(2, '0'); // 补零  
                const seconds = String(item.updated_at.getSeconds()).padStart(2, '0'); // 补零


                // console.log(year)
                // console.log(month)
                // console.log(day)
                // console.log(hours)
                // console.log(minutes)
                // console.log(seconds)
                // console.log('----------')


                return {
                    friendid: item.friendid,
                    friendName: item.friendName,
                    date: (year + '/' + month + '/' + day),
                    time: (hours + ':' + minutes + ':' + seconds)
                }
            })
        }
    }

    return friendStatusClassification
}

module.exports = router
