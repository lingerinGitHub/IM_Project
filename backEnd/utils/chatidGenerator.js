

function B2BchatidGernerator(id1, id2) {
    // 生成一个唯一的聊天id
    if (id1 < id2) {
        return id1 + "_" + id2;
    } else {
        return id2 + "_" + id1;
    }
}

function GroupchatidGernerator(leader) {
    // 生成一个唯一的聊天id
    return id1 + "_" + id2;
}

module.exports = {
    B2BchatidGernerator,
};
