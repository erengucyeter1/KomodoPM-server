export function get_roomId(userIds : string[]) : string {
    const sortedUserIds = userIds.sort();
    return sortedUserIds.join('_');
}