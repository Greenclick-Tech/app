import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
    useContext,
    useLayoutEffect
} from "react";
import styled from "styled-components";
import MapView, { Marker } from "react-native-maps";
import BottomSheet, {
    BottomSheetFlatList,
    BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import {
    View,
    StyleSheet,
    Text,
    Image,
    TouchableOpacity,
    Alert,
    Keyboard,
    ActivityIndicator,
    Animated,
    FlatList,
    Dimensions,
} from "react-native";
import * as Location from "expo-location";
import { Context } from "../../../../helpers/context/context";
import { useIsFocused } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";
import Ionicons from "@expo/vector-icons/Ionicons";
import Swiper from "react-native-swiper";
import moment from "moment";
import CalendarPicker from "react-native-calendar-picker";
import { useQuery, useQueries } from "@tanstack/react-query";
import endpoints from "../../../../constants/endpoints";
import RequestHandler from "../../../../helpers/api/rest_handler";
import CarLoad from "../../../../components/car-load";
import useDebounce from "../../../../helpers/hooks/useDebounce";

const MapContainer = styled.View`
  flex: 1;
  height: 100%;
`;

const DrawerContainer = styled.View`
  width: 100%;
  flex: 1;
`;

const NoResults = styled.Text`
  color: #3b414b;
  font-weight: 400;
  font-size: 16px;
  margin-bottom: 5px;
  margin-top: 10px;
  text-align: center;
  width: 100%;
`;


const PlaceCenter = styled.View`
  width: 100%;
  justify-content: center;
  align-items: center;
`;

const TouchableCar = styled.TouchableOpacity`
  width: 100%;
  border-radius: 5px;
  background-color: #fff;
  border: 1px solid #00000010;
  box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px;
`;

const CarTitle = styled.Text`
  color: #3b414b;
  font-weight: 400;
  font-size: 16px;
  margin-bottom: 5px;
`;


const HotelContainer = styled.View`
  height: auto;
  padding: 0px 20px;
  position: relative;
  margin-bottom: 10px;
`;

const HotelTitle = styled.Text`
  font-size: 18px;
  color: #3b414b;
  font-weight: 500;
  padding: 3px 0px;
`;

const IconFlex = styled.View`
  flex-direction: row;
  width: 100%;
  align-items: center;
`;

const Address = styled.Text`
  font-size: 14px;
  color: #3b414b;
  padding: 3px 0px;
  padding-bottom: 12px;
`;

const WrapperImageTwo = styled.View`
  height: 200px;
  justify-content: center;
  align-items: center;
  border-radius: 5px;
`;

const TouchWrap = styled.View`
  padding: 5px 20px;
  background-color: #fff;
  margin-bottom: 15px;
  display: ${(props) => (props.outline ? "none" : "flex")};
  background-color: ${(props) => (props.outline ? "#fad" : "#fff")};
`;

const TouchablePlace = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  padding: 15px;
  border-radius: 10px;
  background-color: #fff;
  border-bottom-width: 1px;
  border-bottom-color: #e9eff0;
  align-items: center;
`;

const TextPlacesWrapper = styled.View`
  width: 100%;
  flex: 1;
  padding-left: ${(props) => (props.padding ? "0px" : "20px")};
`;

const PlacesTitle = styled.Text`
  font-size: 16px;
  color: #3b414b;
  margin-bottom: 5px;
  font-weight: 500;
`;

const PlaceDescription = styled.Text`
  color: #3b414b;
  font-size: 13px;
  width: 100%;
`;

const FlexRowCon = styled.View`
  flex-direction: row;
  align-items: center;
`;

const FlexRowConJustify = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const TitleDrawer = styled.Text`
  color: #3b414b;
  font-size: 18px;
  font-weight: 500;
`;

const MenuContainer = styled.View`
  padding: 20px 20px;
`;

const TimeWrapper = styled.TouchableOpacity`
  background-color: #4aaf6ecc;
  width: 100%;
  padding: 10px 10px;
  border-radius: 5px;
  border: 1px solid #4aaf6e;
  margin-top: 10px;
  justify-content: center;
`;

const LocationTitle = styled.Text`
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;

const Dates = styled.View`
  flex-direction: row;
  align-items: center;
`;

const DateTile = styled.Text`
  font-size: 14px;
  color: #fff;
`;

const TextWrapper = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const ModalView = styled.Modal`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(Animated.createAnimatedComponent(TouchableOpacity))`
  flex: 1;
`;

const TripTitle = styled.Text`
  color: #3b414b;
  font-weight: 600;
  font-size: 20px;
  margin-left: 0;
  margin-bottom: 7px;
`;

const TripDescription = styled.Text`
  color: #3b414b;
  font-weight: 400;
  font-size: 14px;
  margin-left: 0;
`;

const SeperatorFull = styled.View`
  width: 100%;
  height: 1px;
  border-bottom-width: 1px;
  border-bottom-color: #00000010;
  margin: 20px 0px;
`;

const WrapperFlex = styled.View`
  width: 100%;
  justify-content: space-between;
  flex-direction: row;
  margin-top: 15px;
  padding: 0px 20px;
`;

const ModalMargin = styled.TouchableOpacity`
  flex: 1;
  margin-top: auto;
  background-color: #fff;
  padding: 30px 0px;
`;

const ConfirmButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

const ConfirmText = styled.Text`
  color: ${(props) => (props.color ? "#4aaf6e" : "#727d76")};
  font-size: 18px;
  font-weight: 500;
`;

const CancelText = styled.Text`
  color: ${(props) => (props.reset ? "#f26755" : "#727d76")};
  font-size: 18px;
`;

const PriceWrapper = styled.View`
  flex-direction: row;
  align-items: flex-end;
`;

const PriceMain = styled.Text`
  color: #3b414b;
  font-weight: 600;
  font-size: 16px;
`;

const PriceHour = styled.Text`
  color: #3b414b;
  font-size: 12px;
  margin-bottom: 1px;
  margin-left: 3px;
`;

const TabContainer = styled.View`
  width: 100%;
  flex-direction: row;
`;

const Tab = styled.TouchableOpacity`
  padding: 5px 12px;
  justify-content: center;
  align-items: center;
  flex: 1;
  border-bottom-width: 3px;
  border-bottom-color: ${(props) => (props.color ? "#4aaf6e" : "#AAAAAA80")};
  flex-direction: row;
`;

const TabText = styled.Text`
  color: ${(props) => (props.color ? "#4aaf6e" : "#AAAAAA80")};
  font-size: 16px;
  font-weight: 600;
`;

const DateItem = styled.TouchableOpacity`
  width: 100%;
  padding: 20px;
  border-width: 1px;
  background-color: ${(props) => (props.booked ? "#AAAAAA50" : "#FFFFFF")};
  border-color: ${(props) => (props.selected ? "#4aaf6e" : "#00000010")};
  margin-bottom: 10px;
  display: ${(props) => (props.display ? "none" : "flex")};
`;

const DateText = styled.Text`
  font-size: ${(props) => (props.size ? "18px" : "16px")};
  font-weight: ${(props) => (props.weight ? "600" : "400")};
`;


const HotelsFound = ({ hotels, onPress }) => {
    const getSpecificHotel = async (id) => {
        let res = await RequestHandler(
            "GET",
            endpoints.GET_HOTEL(id),
            undefined,
            undefined,
            true
        );
        if ("error" in res) {
            // SAHIL, HANDLE THIS
            // probably a 404 the hotel doesn't exist maybe
            //
            return res;
        } else {
            return res;
        }
    };

    const mapHotels = useQueries({
        queries:
            hotels?.map((item) => {
                return {
                    queryKey: ["hotel", item.id],
                    queryFn: () => getSpecificHotel(item.id),
                };
            }) ?? [],
    });

    const isLoadHotels =
        mapHotels.every((result) => result.isLoading) &&
        mapHotels.every((result) => result.isLoading);
    const isFetchedHotels =
        mapHotels.every((result) => result.isFetched) &&
        mapHotels.every((result) => result.isFetched);
    const isErrHotels =
        mapHotels.every((result) => result.isError) &&
        mapHotels.every((result) => result.isError);

    return isLoadHotels ? (
        <ActivityIndicator size={"small"}></ActivityIndicator>
    ) : isErrHotels ? (
        <Text>Error getting hotels in your radius.</Text>
    ) : (
        <View>
            {hotels?.map((item, index) => {
                const matchingHotel = mapHotels?.find(
                    (hotel) => hotel?.data?.hotel.id === item.id
                );
                return (
                    matchingHotel &&
                    ("error" in matchingHotel.data ? (
                        <Text>Error Retriving this hotel.</Text>
                    ) : (
                        <TouchableOpacity
                            onPress={() =>
                                onPress(matchingHotel.data.hotel.id, matchingHotel.data.hotel)
                            }
                            key={matchingHotel.data.hotel.id}
                            style={{
                                paddingTop: 10,
                                paddingBottom: 10,
                                alignItems: "center",
                                flexDirection: "row",
                                borderBottomColor: "#00000010",
                                borderBottomWidth: 1,
                            }}
                        >
                            <Image
                                style={{ width: 50, height: 100 }}
                                resizeMethod={"resize"}
                                resizeMode={"contain"}
                                source={require("../../../../assets/pintwo.png")}
                            ></Image>
                            <View style={{ paddingLeft: 15 }}>
                                <Text style={{ fontSize: 17 }}>
                                    {matchingHotel.data.hotel.name}
                                </Text>
                                <Text style={{ fontSize: 13, width: '100%' }}>
                                    {matchingHotel.data.hotel.address.slice(0, 40) + "..."}
                                </Text>
                            </View>

                        </TouchableOpacity>
                    ))
                );
            })}
        </View>
    );
};

const VehicleList = ({
    vehicles,
    navigation,
    masterStart,
    masterEnd,
    selectedHotel,
    vehicleStartDate,
    vehicleEndDate,
    selection,
}) => {
    const getVehicleCalendar = async (hotelID, vehicleID, startDate, endDate) => {
        let res = await RequestHandler(
            "GET",
            endpoints.GET_VEHICLE_CALENDAR(
                hotelID,
                vehicleID,
                moment(startDate).toISOString(),
                moment(endDate).toISOString()
            ),
            undefined,
            undefined,
            true
        );
        if ("error" in res) {
            // SAHIL, HANDLE THIS
            // probably a 404 the hotel doesn't exist maybe
            //
            return res;
        } else {
            res.id = vehicleID;
            return res;
        }
    };

    const vehicleCalendar = useQueries({
        queries:
            vehicles.map((item) => {
                return {
                    queryKey: [
                        "vehicleCalendar",
                        item.hotel_id,
                        item.id,
                        selection == "micro_mobility"
                            ? masterStart
                            : vehicleStartDate,
                        selection == "micro_mobility"
                            ? masterEnd
                            : vehicleEndDate,
                    ],
                    queryFn: () =>
                        getVehicleCalendar(
                            item.hotel_id,
                            item.id,
                            selection == "micro_mobility"
                                ? moment(masterEnd)
                                : vehicleStartDate,
                            selection == "micro_mobility"
                                ? moment(masterEnd)
                                : vehicleEndDate
                        ),
                    enabled: moment(vehicleEndDate).isValid() || moment(masterEnd).isValid()
                };
            }) ?? [],
    });

    const refetchAll = () => {
        vehicleCalendar.queries?.forEach((query) => {
            query.refetch();
        });
    };

    useEffect(() => {
        if (moment(vehicleEndDate).isValid() || moment(masterEnd).isValid()) {
            refetchAll();
        }
    }, [vehicleEndDate, masterEnd, selection]);

    const isLoadVehicles =
        vehicleCalendar.every((result) => result.isLoading) &&
        vehicleCalendar.every((result) => result.isLoading);
    const isFetchedVehicles =
        vehicleCalendar.every((result) => result.isFetched) &&
        vehicleCalendar.every((result) => result.isFetched);
    const isErrVehicles =
        vehicleCalendar.every((result) => result.isError) &&
        vehicleCalendar.every((result) => result.isError);

    return (
        <BottomSheetFlatList
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "none",
            }}
            scrollEnabled={true}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => {
                const matchingVehicle = vehicleCalendar.find(
                    (booking) => booking.data?.id === item.id
                ) ?? {};
                return (
                    <TouchWrap outline={matchingVehicle && matchingVehicle.data?.bookings.length > 0} key={item.id}>
                        <TouchableCar
                            activeOpacity={1}
                            onPress={() => {
                                if (item.micro_mobility) {
                                    if (masterStart) {
                                        navigation.navigate("Details", {
                                            id: item.id,
                                            hotelId: selectedHotel.id,
                                            startDate: masterStart,
                                            endDate: masterEnd,
                                            type: "micro_mobility",
                                        });
                                    } else {
                                        navigation.navigate("Details", {
                                            id: item.id,
                                            hotelId: selectedHotel.id,
                                            type: "micro_mobility",
                                        });
                                    }
                                } else {
                                    if (vehicleStartDate && vehicleEndDate) {
                                        navigation.navigate("Details", {
                                            id: item.id,
                                            hotelId: selectedHotel.id,
                                            startDate: moment(vehicleStartDate).isValid() && vehicleStartDate,
                                            endDate: moment(vehicleEndDate).isValid() && vehicleEndDate,
                                            type: "vehicle",
                                        });
                                    } else {
                                        navigation.navigate("Details", {
                                            id: item.id,
                                            hotelId: selectedHotel.id,
                                            type: "vehicle",
                                        });
                                    }
                                }
                            }}
                        >
                            <WrapperImageTwo>
                                <Swiper dotColor="#fff" activeDotColor="#4aaf6e">
                                    {item.image_urls.map((e) => {
                                        return (
                                            <View onMoveShouldSetResponderCapture={() => true}>
                                                <Image
                                                    style={{
                                                        width: "100%",
                                                        height: 200,
                                                        borderTopLeftRadius: 4,
                                                        borderTopRightRadius: 4,
                                                    }}
                                                    resizeMode="cover"
                                                    source={{
                                                        uri: item.preview_url,
                                                        headers: { Accept: "image/*" },
                                                    }}
                                                ></Image>
                                            </View>
                                        );
                                    })}
                                </Swiper>
                            </WrapperImageTwo>
                            <View style={{ flex: 3, padding: 15 }}>
                                <CarTitle>{item.model}</CarTitle>
                                {vehicleStartDate && vehicleEndDate ? (
                                    <PriceWrapper>
                                        <PriceMain>
                                            ${5 * vehicleEndDate.diff(vehicleStartDate, "hours")}
                                            .00
                                        </PriceMain>
                                        <PriceHour>est. total</PriceHour>
                                    </PriceWrapper>
                                ) : (
                                    <PriceWrapper>
                                        <PriceMain>$5.00</PriceMain>
                                        <PriceHour>/ per hour</PriceHour>
                                    </PriceWrapper>
                                )}
                            </View>
                        </TouchableCar>
                    </TouchWrap>
                );
            }}
            data={vehicles}
        ></BottomSheetFlatList>
    );
};

const MapPage = ({ route, navigation, props }) => {
    const isFocused = useIsFocused();
    const [selectedHotel, setSelectedHotel] = useState();
    const [index, setIndex] = useState(0);
    const [locationLoad, setLocationLoad] = useState(true);

    const { location, setLocation, locationStatus, setLocationStatus } = useContext(Context);
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const [vehicleStartDate, setVehicleStartDate] = useState();
    const [vehicleEndDate, setVehicleEndDate] = useState('');
    const [startVehicleTempDate, setVehicleTempStartDate] = useState();
    const [endVehicleTempDate, setVehicleTempEndDate] = useState();
    const [microStartDate, setMicroStartDate] = useState();
    const [startMicroTempDate, setMicroTempStartDate] = useState();
    const [places, setPlaces] = useState();
    const [loading, setLoading] = useState(true);
    const bottomSheetRef = useRef(null);
    const [isSearching, setIsSearching] = useState(false);
    const snapPoints = useMemo(() => ["15%", "40%", "95%"], []);
    const [searchPlaces, setSearch] = useState("");
    const [selectedHotelID, setSelectedHotelID] = useState("");
    const [selection, setSelection] = useState("vehicles");
    const [modalView, setModalView] = useState(0);
    const [isMapSearching, setIsMapSearching] = useState(false);
    const [mapRegion, setmapRegion] = useState({
        latitude: 48.166666,
        longitude: -100.166666,
        latitudeDelta: 20,
        longitudeDelta: 20,
    });
    const [carsQuery, setCarQueries] = useState([]);
    const debouncedCoordinates = useDebounce(mapRegion, 500);
    const [isLoading, setIsLoading] = useState(false);
    const [timeDates, setTimeDates] = useState([]);
    const [displayDate, setDisplayDate] = useState(new Date());
    const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
    const [masterStart, setMasterStart] = useState(null);
    const [masterEnd, setMasterEnd] = useState(null);
    const mapRef = useRef(null);

    const animateMapRegion = new Animated.Value(0);

    //Location

    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            return;
        }
        //obtaining the users location
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Lowest});
        setLocation(location);
        setLocationStatus(status);
        setLocationLoad(false)
    };

    useLayoutEffect(() => {
        getLocation()
    }, [])

    //    Queries
    // --------------

    const hotelQueries = useQuery({
        queryKey: ["mapHotels", debouncedCoordinates],
        queryFn: () => getConcurrentData(debouncedCoordinates),
        refetchOnWindowFocus: false,
        retry: false,
        keepPreviousData: true,
        enabled: !!location,
    });

    const carQueries = useQuery({
        queryKey: ["cars", selectedHotelID, selection],
        queryFn: () => getCars(selectedHotelID, selection),
        enabled: !!selectedHotelID,
        retry: false,
        keepPreviousData: true,
        onSuccess: (data) => setCarQueries(data.vehicles),
    });

    const specificHotelQuery = useQuery({
        queryKey: ["hotel", selectedHotelID],
        queryFn: () => getSpecificHotel(selectedHotelID),
        enabled: !!selectedHotelID,
        retry: false,
    });

    //   Functions
    // --------------


    const handleRegionChange = (region) => {
        handleSheetChanges(0)
        setmapRegion({
            latitude: region.latitude,
            longitude: region.longitude,
            latitudeDelta: region.latitudeDelta,
            longitudeDelta: region.longitudeDelta,
        });
    };

    const onSelectTimeSlot = (markup, start, end) => {
        let updatedTimeSlots = [];
        if (selectedTimeSlots.length === 0) {
            // If no time slots are selected, add the current one
            updatedTimeSlots.push({ start, end, markup });
            setMasterStart(start);
            setMasterEnd(end);
        } else if (selectedTimeSlots.length === 3) {
            // If three time slots are already selected, reset the array and add the current one
            updatedTimeSlots.push({ start, end, markup });
            setMasterStart(start);
            setMasterEnd(end);
        } else {
            // Check if the current time slot is consecutive to the existing ones
            let lastEnd = moment(selectedTimeSlots[selectedTimeSlots.length - 1].end);
            if (moment(start).isSame(lastEnd)) {
                updatedTimeSlots = [...selectedTimeSlots, { start, end, markup }];
                setMasterEnd(end);
            } else {
                let firstStart = moment(selectedTimeSlots[0].start);
                if (moment(end).isSame(firstStart)) {
                    updatedTimeSlots = [{ start, end, markup }, ...selectedTimeSlots];
                    setMasterStart(start);
                } else {
                    // If the current time slot is not consecutive, reset the array and add the current one
                    updatedTimeSlots.push({ start, end, markup });
                    setMasterStart(start);
                    setMasterEnd(end);
                }
            }
        }
        setSelectedTimeSlots(updatedTimeSlots);
    };

    const handleSheetChanges = useCallback((number) => {
        setIndex(number);
    }, []);

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = (type) => {
        setVehicleTempEndDate();
        setVehicleTempStartDate();
        setTimeout(() => {
            setDatePickerVisibility(false);
        }, 200);
    };

    const handleTempConfirm = (date, type) => {
        if (selection == "vehicles") {
            if (type == "END_DATE") {
                setVehicleTempEndDate(moment(date));
            } else {
                setVehicleTempStartDate(moment(date));
            }
        } else {
            if (type == "END_DATE") {
                setMicroTempEndDate(moment(date));
            } else {
                setMicroTempStartDate(moment(date));
                setDisplayDate(moment(date));
            }
        }
    };

    const handleMarkerPress = (e) => {
        let latitude = e.location.coordinates[1];
        let longitude = e.location.coordinates[0];

        setSelectedHotelID(e.id);
        setSelectedHotel(e);
        handleSheetChanges(1);

        Animated.timing(animateMapRegion, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
        }).start();

        setmapRegion({
            latitude,
            longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
        });
    };

    const handleConfirm = () => {
        setVehicleStartDate(startVehicleTempDate);
        setVehicleEndDate(endVehicleTempDate);
        setVehicleTempEndDate("");
        setVehicleTempStartDate("");
        hideDatePicker();
    };

    const handleHotelPress = (id, hotel) => {
        setSelectedHotelID(id);
        setSelectedHotel(hotel);
    };


    const filteredMarkers =
        hotelQueries.data &&
        hotelQueries.data.hotels &&
        hotelQueries.data?.hotels.filter((e) => {
            const { latitude, longitude, latitudeDelta, longitudeDelta } = mapRegion;
            const markerLatitude = e.location.coordinates[1];
            const markerLongitude = e.location.coordinates[0];
            return (
                markerLatitude >= latitude - latitudeDelta / 2 &&
                markerLatitude <= latitude + latitudeDelta / 2 &&
                markerLongitude >= longitude - longitudeDelta / 2 &&
                markerLongitude <= longitude + longitudeDelta / 2
            );
        });


    const getConcurrentData = async (region) => {
        let res = await RequestHandler(
            "GET",
            endpoints.SEARCH_HOTELS({
                q: "map",
                long: region.longitude,
                lat: region.latitude,
            }),
            undefined,
            undefined,
            true
        );
        if ("error" in res) {
            // SAHIL, HANDLE THIS
            // probably a 400, maybe the long/lat was malformed or server couldnt parse it, or something like that
            // React Query Handling Errors
        } else {
            return res;
        }
    };

    const getSpecificHotel = async (id) => {
        let res = await RequestHandler(
            "GET",
            endpoints.GET_HOTEL(id),
            undefined,
            undefined,
            true
        );
        if ("error" in res) {
            // SAHIL, HANDLE THIS
            // probably a 404 the hotel doesn't exist maybe
            //
            Alert.alert(
                "Error Selecting Hotel",
                "An unexpected error occured selecting this hotel, please try again."
            );
        } else {
            return res;
        }
    };

    async function getCars() {
        let res = await RequestHandler(
            "GET",
            endpoints.GET_HOTEL_VEHICLES(selectedHotelID, selection),
            undefined,
            undefined,
            true
        );
        if ("error" in res) {
            // SAHIL, HANDLE THIS
            // could be a 400, if the selectedHotel.id is malformed or something
            //
        } else {
            return res;
        }
    }

    //   Effects
    // ------------


    useEffect(() => {

        if (!isLoading) {
            setLoading(false);
        }

    }, [isLoading]);

    useEffect(() => {
        if (selection && selectedHotelID) {
            carQueries.refetch();
        }
    }, [selection]);

    useEffect(() => {
        if (specificHotelQuery.data) {
            setSelectedHotel(specificHotelQuery.data.hotel);
        }
    }, [specificHotelQuery.isFetched]);

    useEffect(() => {
        if (!hotelQueries.isLoading) {
            setLoading(false);
        }
    }, [hotelQueries.isLoading]);

    useEffect(() => {
        if (startMicroTempDate) {
            let current = moment(startMicroTempDate).startOf("day");
            let end = moment(current).add(1, "day").endOf("day");
            let timeDates = [];
            let firstNextDayTimeSet = false;

            while (current.isBefore(end)) {
                let next = moment(current).add(2, "hours");
                let isNextDay = false;
                if (current.isSame(end, "day") && !firstNextDayTimeSet) {
                    isNextDay = true;
                    firstNextDayTimeSet = true;
                }
                timeDates.push({
                    start: current,
                    isNextDay: isNextDay,
                    end: next,
                    time: `${current.format("HH:mm")} - ${next.format("HH:mm")}`,
                    markup: `${current.format("h:mma")} - ${next.format("h:mma")}`,
                });
                current = next;
            }
            setTimeDates(timeDates);
        }
    }, [startMicroTempDate]);

    useEffect(() => {
        setIsSearching(true);
        const delaySearch = setTimeout(() => {
            axios
                .get(
                    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${searchPlaces}&&location=${location.coords.latitude}%2C${location.coords.longitude}&&radius=1000&key=AIzaSyBZR2Mae8MxS4Q---MQl87gG1CGTVNZy5w`
                )
                .then((res) => {
                    setPlaces(res.data.predictions);
                });
            setIsSearching(false);
        }, 500);
        if (searchPlaces == 0) {
            clearTimeout(delaySearch);
            setIsSearching(false);
            setPlaces("");
        }
        return () => clearTimeout(delaySearch);
    }, [searchPlaces]);

    useEffect(() => {
        if (location) {
            setmapRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.08,
                longitudeDelta: 0.08,
            });
        }
    }, [location]);

    useEffect(() => { }, [filteredMarkers]);


    useFocusEffect(
        React.useCallback(() => {
            if (route.params?.hotelID) {
                handleSheetChanges(1);
                setSelectedHotelID(route.params.hotelID);
                route.params.hotelID = null;
            }
        }, [isFocused])
    );



    return <MapContainer>
        <ModalView
            visible={isDatePickerVisible}
            transparent={true}
            animationType="slide"
        >
            <ModalContent activeOpacity={1} onPress={hideDatePicker}>
                <ModalMargin onPress={() => null} activeOpacity={1}>
                    <View
                        style={{
                            flexDirection: "row",
                            paddingLeft: 15,
                            paddingRight: 15,
                            width: "100%",
                            paddingTop: 30,
                            paddingBottom: 7,
                            justifyContent: "space-between",
                        }}
                    >
                        {selection == "micro_mobility" ? (
                            <View
                                style={{
                                    flex: 1,
                                    paddingRight: 5,
                                }}
                            >
                                {modalView == 0 ? (
                                    <TripTitle>Step 1: Select a Date</TripTitle>
                                ) : (
                                    <TripTitle>Step 2: Select a Time</TripTitle>
                                )}
                            </View>
                        ) : (
                            <TripTitle>Select your Trip Dates</TripTitle>
                        )}
                        <View style={{}}>
                            <Ionicons
                                onPress={hideDatePicker}
                                name={"close-circle"}
                                size={24}
                                color={"#3B414B"}
                            ></Ionicons>
                        </View>
                    </View>
                    {selection == "micro_mobility" ? (
                        //Micro Mobility
                        <View
                            style={{
                                paddingLeft: 15,
                                paddingRight: 15,
                            }}
                        >
                            <TripDescription>
                                Micro Mobility vehicles are only available for up to 1 day
                                at a time. Please select your booking date and then, a time
                                slot you will be renting from.
                            </TripDescription>
                        </View>
                    ) : (
                        //Vehicles
                        <View
                            style={{
                                paddingLeft: 15,
                                paddingRight: 15,
                            }}
                        >
                            <TripDescription>
                                Micro Mobility vehicles are only available for up to 1 day
                                at a time. Please select your booking date and then, a time
                                slot you will be renting from.
                            </TripDescription>
                        </View>
                    )}

                    <SeperatorFull></SeperatorFull>

                    {selection == "micro_mobility" ? (
                        //if Selection Micro Mobility

                        modalView == 0 ? (
                            //if screen 1
                            <CalendarPicker
                                onDateChange={handleTempConfirm}
                                allowRangeSelection={selection != "micro_mobility"}
                                minDate={moment()}
                                selectedDayColor="#4aaf6e"
                                selectedDayTextColor="#FFFFFF"
                                previousTitle="Back"
                                dayLabelsWrapper={{
                                    borderColor: "#FFF",
                                }}
                                selectedStartDate={microStartDate}
                            />
                        ) : (
                            //if screen 2
                            <View
                                style={{
                                    width: "100%",
                                    flex: 1,
                                }}
                            >
                                <View
                                    style={{
                                        width: "100%",
                                        paddingLeft: 20,
                                        paddingRight: 20,
                                        paddingBottom: 10,
                                        flexDirection: "row",
                                    }}
                                >
                                    <Ionicons name="calendar" size={18}></Ionicons>
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            paddingLeft: 10,
                                        }}
                                    >
                                        {moment(displayDate).format("dddd, MMMM, Do YYYY")}
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        borderBottomColor: "#00000040",
                                        borderBottomWidth: 1,
                                        paddingLeft: 38,
                                        paddingBottom: 20,
                                    }}
                                >
                                    <Text
                                        style={{
                                            fontSize: 16,
                                            paddingLeft: 10,
                                            color: "#4aaf6e",
                                            fontWeight: "600",
                                        }}
                                    >
                                        {masterStart
                                            ? moment(masterStart).format('LT') + " - " + moment(masterEnd).format('LT')
                                            : "Select a Time"}
                                    </Text>
                                </View>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        flex: 1,
                                    }}
                                >
                                    {timeDates.length > 0 ? (
                                        <FlatList
                                            style={{
                                                paddingTop: 10,
                                            }}
                                            data={timeDates}
                                            keyExtractor={(item, index) => index.toString()}
                                            renderItem={({ item }) => {
                                                return (
                                                    <View
                                                        style={{
                                                            flex: 1,
                                                            width: "100%",
                                                            paddingLeft: 20,
                                                            paddingRight: 20,
                                                        }}
                                                    >
                                                        {item.isNextDay && (
                                                            <View
                                                                style={{
                                                                    paddingTop: 15,
                                                                    paddingBottom: 15,
                                                                }}
                                                            >
                                                                <DateText size weight>
                                                                    Results for the Next Day
                                                                </DateText>
                                                            </View>
                                                        )}
                                                        {moment(item.start).isBefore(moment()) ? (
                                                            <DateItem activeOpacity={1} booked>
                                                                <DateText>{item.markup}</DateText>
                                                            </DateItem>
                                                        ) : (
                                                            <DateItem
                                                                selected={selectedTimeSlots.findIndex(selected => moment(selected.start).isSame(moment(item.start))) !== -1}
                                                                onPress={() => {
                                                                    onSelectTimeSlot(
                                                                        item.markup,
                                                                        item.start,
                                                                        item.end
                                                                    );
                                                                }}
                                                            >
                                                                <DateText>{item.markup}</DateText>
                                                            </DateItem>
                                                        )}
                                                    </View>
                                                );

                                                // timeDates.push({
                                                //   start: current,
                                                //   end: next,
                                                //   time: `${current.format("HH:mm")} - ${next.format("HH:mm")}`,
                                                //   markup: `${current.format("h:mma")} - ${next.format("h:mma")}`,
                                                // });
                                            }}
                                        />
                                    ) : (
                                        <ActivityIndicator size={"small"}></ActivityIndicator>
                                    )}
                                </View>
                            </View>
                        )
                    ) : (
                        //if selection is vehicles
                        <CalendarPicker
                            onDateChange={handleTempConfirm}
                            allowRangeSelection={selection != "micro_mobility"}
                            minDate={moment()}
                            selectedDayColor="#4aaf6e"
                            selectedDayTextColor="#FFFFFF"
                            previousTitle="Back"
                            dayLabelsWrapper={{
                                borderColor: "#FFF",
                            }}
                            selectedStartDate={vehicleStartDate}
                            selectedEndDate={vehicleEndDate}
                        />
                    )}

                    {/* //Buttons */}
                    {selection == "micro_mobility" ? (
                        //micro mobility
                        modalView == 0 ? (
                            <WrapperFlex>
                                <ConfirmButton onPress={hideDatePicker}>
                                    <CancelText>Cancel</CancelText>
                                </ConfirmButton>
                                {startMicroTempDate ? (
                                    <ConfirmButton
                                        onPress={() => {
                                            setMicroStartDate(startMicroTempDate);
                                            setModalView(1);
                                        }}
                                    >
                                        <ConfirmText color>Next</ConfirmText>
                                    </ConfirmButton>
                                ) : (
                                    <ConfirmButton>
                                        <ConfirmText>Next</ConfirmText>
                                    </ConfirmButton>
                                )}
                            </WrapperFlex>
                        ) : (
                            <WrapperFlex>
                                <ConfirmButton onPress={() => setModalView(0)}>
                                    <CancelText>Back</CancelText>
                                </ConfirmButton>
                                {masterStart ? (
                                    <ConfirmButton
                                        onPress={() => {
                                            setModalView(0);
                                            hideDatePicker();
                                        }}
                                    >
                                        <ConfirmText color>Next</ConfirmText>
                                    </ConfirmButton>
                                ) : (
                                    <ConfirmButton>
                                        <ConfirmText>Next</ConfirmText>
                                    </ConfirmButton>
                                )}
                            </WrapperFlex>
                        )
                    ) : //vehicles
                        endVehicleTempDate == "" ? (
                            <WrapperFlex>
                                <ConfirmButton onPress={hideDatePicker}>
                                    <CancelText>Cancel</CancelText>
                                </ConfirmButton>
                                <ConfirmButton>
                                    <ConfirmText>Confirm</ConfirmText>
                                </ConfirmButton>
                            </WrapperFlex>
                        ) : (
                            <WrapperFlex>
                                <ConfirmButton onPress={hideDatePicker}>
                                    <CancelText>Cancel</CancelText>
                                </ConfirmButton>
                                <ConfirmButton onPress={handleConfirm}>
                                    <ConfirmText color>Confirm</ConfirmText>
                                </ConfirmButton>
                            </WrapperFlex>
                        )}
                </ModalMargin>
            </ModalContent>
        </ModalView>
        <MapView
            style={{ alignSelf: "stretch", height: "100%" }}
            userInterfaceStyle={"light"}
            showsUserLocation={true}
            region={mapRegion}
            rotateEnabled={false}
            ref={mapRef}
            onRegionChangeComplete={(Region) => handleRegionChange(Region)}
            mapPadding={!!hotelQueries.data ? { top: -300, left: 0, right: 0, bottom: 0 } : null}
        >
            {filteredMarkers?.map((e) => {
                return (
                    <Marker
                        key={e.id}
                        coordinate={{
                            latitude: e.location.coordinates[1],
                            longitude: e.location.coordinates[0],
                        }}
                        onPress={() => handleMarkerPress(e)}
                    >
                        <Image
                            source={require("../../../../assets/pin.png")}
                            style={{ flex: 1, width: 30 }}
                            resizeMode={"contain"}
                            resizeMethod="scale"
                        ></Image>
                    </Marker>
                );
            })}
        </MapView>

        <BottomSheet
            ref={bottomSheetRef}
            index={index}
            animateOnMount={true}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            keyboardBehavior={"extend"}
            keyboardBlurBehavior={"restore"}
            backgroundStyle={"ViewStyle"}
        >
            {location ?
                <DrawerContainer>
                    {selectedHotel ? (
                        <></>
                    ) : (
                        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
                            {hotelQueries.isLoading ? (
                                <ActivityIndicator size="small"></ActivityIndicator>
                            ) : (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        alignItems: "center",
                                        backgroundColor: "#e8e8e8",
                                        paddingTop: 5,
                                        paddingBottom: 5,
                                        paddingLeft: 15,
                                        paddingRight: 15,
                                        width: "100%",
                                        borderRadius: 20,
                                    }}
                                >
                                    <Ionicons
                                        name={"search"}
                                        size={20}
                                        color={"#3B414B80"}
                                    ></Ionicons>
                                    <BottomSheetTextInput
                                        style={{
                                            fontSize: 16,
                                            lineHeight: 20,
                                            flex: 1,
                                            height: 50,
                                            paddingLeft: 10,
                                            paddingRight: 10
                                        }}
                                        placeholder={"Enter a hotel, airport, or address"}
                                        placeholderTextColor={"#494d5280"}
                                        accessibilityTraits
                                        clearButtonMode="always"
                                        onClear={() => {
                                            setSearch("");
                                        }}
                                        onChangeText={(e) => {
                                            setSearch(e);
                                        }}
                                    ></BottomSheetTextInput>
                                    <View>
                                        {hotelQueries.isLoading ? (
                                            <ActivityIndicator size={"small"}></ActivityIndicator>
                                        ) : hotelQueries.isError ? (
                                            <Ionicons
                                                name={"alert"}
                                                size={20}
                                                color={"#FF0000"}
                                            ></Ionicons>
                                        ) : (
                                            <></>
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>
                    )}
                    {hotelQueries.isError ? (
                        <View>
                            <Text
                                style={{
                                    paddingLeft: 20,
                                    paddingTop: 20,
                                    paddingBottom: 10,
                                    fontSize: 18,
                                }}
                            >
                                Error Finding Hotels
                            </Text>
                            <Text
                                style={{
                                    paddingLeft: 20,
                                    paddingRight: 20,
                                    fontSize: 14,
                                }}
                            >
                                An issue occured searching for hotels. Please contact our
                                support at {"\n"}https://support.greenclick.app/
                            </Text>
                        </View>
                    ) : (
                        <></>
                    )}
                    {selectedHotel ? (
                        <View style={{ flex: 1 }}>
                            {specificHotelQuery.isLoading ? (
                                <ActivityIndicator size="small" />
                            ) : specificHotelQuery.data ? (
                                <View style={{ flex: 1 }}>
                                    <HotelContainer>
                                        <IconFlex>
                                            <Ionicons
                                                style={{ marginRight: 10 }}
                                                name={"bed-outline"}
                                                size={22}
                                                color={"#3B414B"}
                                            ></Ionicons>
                                            <HotelTitle>{specificHotelQuery.data.hotel.name}</HotelTitle>
                                        </IconFlex>
                                        <Address>{specificHotelQuery.data.hotel.address}</Address>

                                        <TouchableOpacity
                                            style={{ position: "absolute", top: 0, right: 20 }}
                                            onPress={() => {
                                                setSelectedHotel();
                                                setSelectedHotelID();
                                                handleSheetChanges(0);
                                            }}
                                        >
                                            <Ionicons
                                                name={"close-circle"}
                                                size={24}
                                                color={"#3B414B"}
                                            ></Ionicons>
                                        </TouchableOpacity>
                                        <TabContainer>
                                            <Tab
                                                onPress={() => {
                                                    setVehicleStartDate('')
                                                    setVehicleEndDate('')
                                                    setMasterStart('')
                                                    setMasterEnd('')
                                                    setSelectedTimeSlots([])
                                                    setSelection("vehicles");
                                                }}
                                                color={selection == "vehicles"}
                                            >
                                                <Ionicons
                                                    name={"car-sport"}
                                                    size={20}
                                                    color={
                                                        selection == "vehicles" ? "#4aaf6e" : "#AAAAAA80"
                                                    }
                                                    style={{ paddingRight: 5 }}
                                                ></Ionicons>
                                                <TabText color={selection == "vehicles"}>
                                                    Vehicles
                                                </TabText>
                                            </Tab>
                                            <Tab
                                                onPress={() => {
                                                    setVehicleStartDate('');
                                                    setVehicleEndDate('');
                                                    setSelection("micro_mobility");
                                                }}
                                                color={selection == "micro_mobility"}
                                            >
                                                <Ionicons
                                                    name={"bicycle"}
                                                    size={20}
                                                    style={{ paddingRight: 5 }}
                                                    color={
                                                        selection == "micro_mobility"
                                                            ? "#4aaf6e"
                                                            : "#AAAAAA80"
                                                    }
                                                ></Ionicons>
                                                <TabText color={selection == "micro_mobility"}>
                                                    Micro Mobility
                                                </TabText>
                                            </Tab>
                                        </TabContainer>

                                        <TimeWrapper onPress={showDatePicker}>
                                            <TextWrapper>
                                                {selection == "vehicles" ? (
                                                    vehicleStartDate && vehicleEndDate ? (
                                                        <Dates>
                                                            <Ionicons
                                                                name="search"
                                                                size={12}
                                                                color={"#fff"}
                                                                style={{ marginRight: 5 }}
                                                            ></Ionicons>
                                                            <DateTile>
                                                                {vehicleStartDate.format("MMMM Do")}
                                                            </DateTile>
                                                            <DateTile> to </DateTile>
                                                            <DateTile>
                                                                {vehicleEndDate.format("MMMM Do")}
                                                            </DateTile>
                                                        </Dates>
                                                    ) : (
                                                        <Dates>
                                                            <Ionicons
                                                                name="search"
                                                                size={12}
                                                                color={"#fff"}
                                                                style={{ marginRight: 5 }}
                                                            ></Ionicons>
                                                            <DateTile>
                                                                Searching all {selection.replace("_", " ")}
                                                            </DateTile>
                                                        </Dates>
                                                    )
                                                ) : masterStart ? (
                                                    <Dates>
                                                        <Ionicons
                                                            name="search"
                                                            size={12}
                                                            color={"#fff"}
                                                            style={{ marginRight: 5 }}
                                                        ></Ionicons>
                                                        <DateTile>
                                                            {masterStart.format("MMM Do") + " "}
                                                        </DateTile>
                                                        <DateTile>
                                                            {moment(masterStart).format("LT")}
                                                        </DateTile>
                                                        <DateTile> - </DateTile>
                                                        <DateTile>
                                                            {moment(masterEnd).format("LT")}
                                                        </DateTile>
                                                    </Dates>
                                                ) : (
                                                    <Dates>
                                                        <Ionicons
                                                            name="search"
                                                            size={12}
                                                            color={"#fff"}
                                                            style={{ marginRight: 5 }}
                                                        ></Ionicons>
                                                        <DateTile>
                                                            Searching all {selection.replace("_", " ")}
                                                        </DateTile>
                                                    </Dates>
                                                )}
                                                <LocationTitle>Edit</LocationTitle>
                                            </TextWrapper>
                                        </TimeWrapper>
                                        <TouchableOpacity
                                            onPress={() => {
                                                setVehicleEndDate('');
                                                setVehicleStartDate('');
                                                setMasterStart('')
                                                setMasterEnd('')
                                                setSelectedTimeSlots([])
                                            }}
                                        >
                                            <Text
                                                style={{
                                                    paddingTop: 10,
                                                    color: "#f26755",
                                                    textAlign: "left",
                                                }}
                                            >
                                                Reset Filters
                                            </Text>
                                        </TouchableOpacity>

                                        {/* <Results>{cars ? cars.length : 0} results found</Results> */}
                                    </HotelContainer>
                                    {carQueries.isLoading ? (
                                        <ActivityIndicator size={"small"}></ActivityIndicator>
                                    ) : carQueries.isError ? (
                                        <NoResults>
                                            An error occured searching vehicles, please try again
                                        </NoResults>
                                    ) : carQueries.data?.vehicles && carsQuery ? (
                                        <VehicleList
                                            vehicles={carQueries.data.vehicles}
                                            navigation={navigation}
                                            masterEnd={masterEnd}
                                            masterStart={masterStart}
                                            selectedHotel={selectedHotel}
                                            vehicleStartDate={vehicleStartDate}
                                            vehicleEndDate={vehicleEndDate}
                                            selection={selection}
                                        ></VehicleList>
                                    ) : (
                                        <NoResults>No Vehicles Found</NoResults>
                                    )}
                                </View>
                            ) : specificHotelQuery.isError ? (
                                <NoResults>
                                    An error occured searching vehicles, please try again
                                </NoResults>
                            ) : (
                                <NoResults>No Results Found</NoResults>
                            )}
                        </View>
                    ) : (
                        <View style={{ flex: 1 }}>
                            <MenuContainer>
                                {places ? (
                                    <FlexRowConJustify>
                                        <TitleDrawer>Search Hotels</TitleDrawer>
                                        {/* <Text
                    style={{
                    color: "#00000050",
                    }}
                >
                    {hotelQueries.data.hotels ? hotelQueries.data.hotels.length : 0} Hotels Found
                </Text> */}
                                    </FlexRowConJustify>
                                ) : (
                                    <View>
                                        <HotelTitle>Hotels Found</HotelTitle>
                                        {filteredMarkers ? (
                                            <HotelsFound
                                                onPress={handleHotelPress}
                                                hotels={filteredMarkers}
                                            ></HotelsFound>
                                        ) : (
                                            <Text>No hotels found in your radius.</Text>
                                        )}
                                    </View>
                                )}
                            </MenuContainer>
                            {isSearching ? (
                                <PlaceCenter>
                                    <ActivityIndicator size="small"></ActivityIndicator>
                                </PlaceCenter>
                            ) : (
                                <BottomSheetFlatList
                                    style={{
                                        backgroundColor: "none",
                                    }}
                                    scrollEnabled={true}
                                    renderItem={({ item }) => {
                                        return (
                                            <TouchWrap>
                                                {places ? (
                                                    <View>
                                                        {hotelQueries.isFetched &&
                                                            hotelQueries.data.hotels?.find(
                                                                (e) =>
                                                                    e.address ===
                                                                    item.structured_formatting.secondary_text
                                                            ) ? (
                                                            // <TouchablePlace
                                                            //   onPress={() => {
                                                            //     setSelectedHotel(
                                                            //       hotelQueries.data.hotels.find(
                                                            //         (e) =>
                                                            //           e.address ===
                                                            //           item.structured_formatting
                                                            //             .secondary_text
                                                            //       )
                                                            //     );
                                                            //     handleSheetChanges(1);
                                                            //     setmapRegion({
                                                            //       latitude: hotelQueries.data.hotels.find(
                                                            //         (e) =>
                                                            //           e.address ===
                                                            //           item.structured_formatting
                                                            //             .secondary_text
                                                            //       ).coordinates.latitude,
                                                            //       longitude: hotelQueries.data.hotels.find(
                                                            //         (e) =>
                                                            //           e.address ===
                                                            //           item.structured_formatting
                                                            //             .secondary_text
                                                            //       ).coordinates.longitude,
                                                            //       latitudeDelta: 0.002,
                                                            //       longitudeDelta: 0.002,
                                                            //     });
                                                            //   }}
                                                            // >
                                                            //   <Image
                                                            //     style={{
                                                            //       maxHeight: 40,
                                                            //       maxWidth: 24,
                                                            //       marginRight: 15,
                                                            //     }}
                                                            //     resizeMode="contain"
                                                            //     source={require("../../../../assets/pin.png")}
                                                            //   ></Image>
                                                            //   <TextPlacesWrapper>
                                                            //     <FlexRowCon>
                                                            //       <PlacesTitle style={{ color: "#4aaf6e" }}>
                                                            //         {item.structured_formatting.main_text}
                                                            //       </PlacesTitle>
                                                            //     </FlexRowCon>
                                                            //     <PlaceDescription>
                                                            //       {
                                                            //         item.structured_formatting
                                                            //           .secondary_text
                                                            //       }
                                                            //     </PlaceDescription>
                                                            //     <PlaceDescription style={{ paddingTop: 5 }}>
                                                            //       {
                                                            //         hotelQueries.data.hotels.find(
                                                            //           (e) =>
                                                            //             e.address ===
                                                            //             item.structured_formatting
                                                            //               .secondary_text
                                                            //         ).vehicles.length
                                                            //       }{" "}
                                                            //       Cars Available
                                                            //     </PlaceDescription>
                                                            //   </TextPlacesWrapper>
                                                            // </TouchablePlace>
                                                            <></>
                                                        ) : (
                                                            <TouchablePlace
                                                                //Setting from Search
                                                                onPress={async () => {
                                                                    Keyboard.dismiss();
                                                                    await axios
                                                                        .get(
                                                                            `https://maps.googleapis.com/maps/api/place/details/json?place_id=${item.place_id}&key=AIzaSyBZR2Mae8MxS4Q---MQl87gG1CGTVNZy5w`
                                                                        )
                                                                        .then((res) => {
                                                                            handleSheetChanges(0);
                                                                            setmapRegion({
                                                                                latitude:
                                                                                    res.data.result.geometry.location
                                                                                        .lat,
                                                                                longitude:
                                                                                    res.data.result.geometry.location
                                                                                        .lng,
                                                                                latitudeDelta: 0.1,
                                                                                longitudeDelta: 0.1,
                                                                            });
                                                                        });
                                                                    setSearch("");
                                                                    //res.data.result.geometry.location.lat
                                                                }}
                                                            >
                                                                <TextPlacesWrapper padding>
                                                                    <PlaceDescription
                                                                        style={{
                                                                            color: "#3B414B570",
                                                                            marginBottom: 4,
                                                                        }}
                                                                    >
                                                                        Hotels Nearby
                                                                    </PlaceDescription>
                                                                    <PlacesTitle>
                                                                        {item.structured_formatting.main_text}
                                                                    </PlacesTitle>
                                                                    <PlaceDescription>
                                                                        {
                                                                            item.structured_formatting
                                                                                .secondary_text
                                                                        }
                                                                    </PlaceDescription>
                                                                </TextPlacesWrapper>
                                                            </TouchablePlace>
                                                        )}
                                                    </View>
                                                ) : (
                                                    <TouchablePlace
                                                        onPress={() => {
                                                            setSelectedHotelID(item.id);
                                                            setSelectedHotel(item);
                                                            handleSheetChanges(1);
                                                            Keyboard.dismiss();
                                                            setmapRegion({
                                                                latitude: item.location.coordinates[1],
                                                                longitude: item.location.coordinates[0],
                                                                latitudeDelta: 0.1,
                                                                longitudeDelta: 0.1,
                                                            });
                                                        }}
                                                    >
                                                        <Image
                                                            style={{ maxHeight: 40, maxWidth: 24 }}
                                                            resizeMode="contain"
                                                            source={require("../../../../assets/pin.png")}
                                                        ></Image>
                                                        <TextPlacesWrapper>
                                                            <FlexRowCon>
                                                                <PlacesTitle style={{ color: "#4aaf6e" }}>
                                                                    {item.name}
                                                                </PlacesTitle>
                                                            </FlexRowCon>
                                                            <PlaceDescription>
                                                                {item.address}
                                                            </PlaceDescription>
                                                            <PlaceDescription style={{ paddingTop: 5 }}>
                                                                {item.vehicle_count} Cars Available
                                                            </PlaceDescription>
                                                        </TextPlacesWrapper>
                                                    </TouchablePlace>
                                                )}
                                            </TouchWrap>
                                        );
                                    }}
                                    data={places}
                                ></BottomSheetFlatList>
                            )}
                        </View>
                    )}
                </DrawerContainer>
                :
                locationLoad ?
                    <ActivityIndicator size={'small'}></ActivityIndicator>
                    :
                    locationStatus == 'granted' ?
                        <></>
                        :
                        <View style={{
                            paddingLeft: 15,
                            paddingRight: 15,
                            paddingTop: 20
                        }}>
                            <Subtitle>Your Location was not found.</Subtitle>
                            <SubtitleTwo>In order to use the greenclick app, please allow location permissions located in your devices settings.</SubtitleTwo>
                        </View>

            }
        </BottomSheet>
    </MapContainer>
};

export default MapPage;
