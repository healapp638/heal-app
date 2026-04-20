"use strict";
// import redis from "../services/redis.service";
// export const getCache = async (key: string) => {
//     try {
//         const data = await redis.get(key);
//         return data ? JSON.parse(data) : null;
//     } catch (error) {
//         console.error("Redis GET Error:", error);
//         return null;
//     }
// };
// export const setCache = async (key: string, value: any, ttlSeconds: number) => {
//     try {
//         await redis.set(key, JSON.stringify(value), "EX", ttlSeconds);
//     } catch (error) {
//         console.error("Redis SET Error:", error);
//     }
// };
// export const deleteCache = async (key: string) => {
//     try {
//         await redis.del(key);
//     } catch (error) {
//         console.error("Redis DEL Error:", error);
//     }
// };
