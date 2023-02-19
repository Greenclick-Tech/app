export default {
    BASE_URL: `https://api.greenclicktechnologies.com/api/v1`,

    LOGIN: () =>  `/auth/login`,
    REGISTER: () => `/auth/register`,
    VERIFY: () => `/auth/verify`,
    TOKEN: () => `/auth/token`,

    SAVE_PUSH_TOKEN: () => `/push-token`,

    GET_CURRENT_USER: () => `/me`,
    GET_USER_BOOKINGS: (active = false) => `/bookings${active ? `?active=true` : ``}`,
    GET_USER_BOOKING: (id) => `/bookings/${id}`,

    SEARCH_HOTELS: (query) => `/hotels?${new URLSearchParams(query)}`,
    GET_HOTEL: (id) => `/hotels/${id}`,
    CHECK_BOX_PROXIMITY: (id, lat, long) => `/hotels/${id}/near-box?${new URLSearchParams({lat, long})}`,

    GET_HOTEL_VEHICLES: (id, type) => `/hotels/${id}/vehicles?type=${type}`,
    GET_VEHICLE: (hotelID, vehicleID) => `/hotels/${hotelID}/vehicles/${vehicleID}`,
    GET_VEHICLE_CALENDAR: (hotelID, vehicleID, startDate, endDate) => `/hotels/${hotelID}/vehicles/${vehicleID}/bookings?from=${startDate}&to=${endDate}`,
    UNLOCK_VEHICLE_LATCH: (hotelID, vehicleID, returnKeys = false) => `/hotels/${hotelID}/vehicles/${vehicleID}/unlock-latch${returnKeys ? `?return=true` : ``}`,

    GET_ORDER_SUBTOTAL: (hotelID, vehicleID) => `/hotels/${hotelID}/vehicles/${vehicleID}/order-subtotal`,
    CREATE_PAYMENT_INTENT: (hotelID, vehicleID) => `/hotels/${hotelID}/vehicles/${vehicleID}/payment-intent`,
    GET_PUBLISHABLE_KEY: () => `/stripe/pub-key`,

}
