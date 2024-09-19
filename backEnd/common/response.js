// 返回的格式（响应码，请求体）
function responseBody(ctx, set, type, status, data){
    if(set)
    return {
        'type': type,
        'status': status,
        'data': data
    }
}