export default {
    BASE_URL: `https://api.greenclicktechnologies.com/v1/`,

    VERIFY: () => `/auth/code`,
    REGISTER: () => `/auth/register`,
    VALIDATE: () => `/auth/validate`,
    LOGIN: () =>  `/auth/login`,
    TOKEN: () => `/auth/token`,

    GET_CURRENT_USER: () => `/me`,
    DELETE: () => `/me`,
    GET_NOTIFICATIONS: () => `/me/notifications`,
    VERIFY_EMAIL: () => `/me/email`,
    VERIFY_USER: () => `/me/identity`,
    GET_USER_SETTINGS: () => `/settings`,
    GET_USER_BOOKINGS: (active = false) => `/me/bookings${active ? `?active=true` : ``}`,
    GET_USER_BOOKING: (id) => `/me/bookings/${id}`,

    SEARCH_HOTELS: (query) => `/hotels?${new URLSearchParams(query)}`,
    GET_HOTEL: (id) => `/hotels/${id}`,
    CHECK_BOX_PROXIMITY: (id, lat, long) => `/hotels/${id}/proximity?${new URLSearchParams({lat, long})}`,

    GET_HOTEL_VEHICLES: (id, type = "car") => `/hotels/${id}/vehicles?type=${type}`,
    GET_VEHICLE: (hotelID, vehicleID) => `/hotels/${hotelID}/vehicles/${vehicleID}`,
    GET_VEHICLE_BOOKINGS: (hotelID, vehicleID, startDate, endDate) => `/hotels/${hotelID}/vehicles/${vehicleID}/bookings?from=${startDate}&to=${endDate}`,
    GET_VEHICLE_INSURANCES: (hotelID, vehicleID) => `/hotels/${hotelID}/vehicles/${vehicleID}/insurances`,
    UNLOCK_VEHICLE_LATCH: (bookingID, returnKeys = false) => `/me/bookings/${bookingID}/keys${returnKeys ? `?return=true` : ``}`,

    GET_ORDER_SUBTOTAL: (hotelID, vehicleID) => `/hotels/${hotelID}/vehicles/${vehicleID}/subtotal`,
    CREATE_PAYMENT_INTENT: (hotelID, vehicleID) => `/hotels/${hotelID}/vehicles/${vehicleID}/payment`,
    GET_PUBLISHABLE_KEY: () => `/stripe/key`,

}