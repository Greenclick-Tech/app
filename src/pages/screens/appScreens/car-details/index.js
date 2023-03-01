import * as React from "react";
import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  FlatList,
} from "react-native";
import styled from "styled-components";
import Ionicons from "@expo/vector-icons/Ionicons";
import moment from "moment";
import CalendarPicker from "react-native-calendar-picker";
import CustomButton from "../../../../components/custom-button";
import { useIsFocused } from "@react-navigation/native";
import Swiper from "react-native-swiper";
import RequestHandler from "../../../../helpers/api/rest_handler";
import endpoints from "../../../../constants/endpoints";
import { useQuery } from "@tanstack/react-query";
import CarLoad from "../../../../components/car-load";

const Container = styled.View`
  width: 100%;
  flex: 1;
  padding: 0px 15px;
  border-radius-top-left: 30;
  border-radius-top-right: 30;
  border-radius-bottom-left: 30;
  border-radius-bottom-rightr: 30;
  background-color: #fff;
  top: -30px;
`;

const WrapperImage = styled.View`
  border-bottom-width: 1px;
  padding-bottom: 2px;
  border-bottom-color: #00000010;
  height: 300px;
  justify-content: center;
  align-items: center;
  background-color: #4aaf6e;
`;

const Title = styled.Text`
  color: #3b414b;
  font-weight: bold;
  font-size: 26px;
  margin-bottom: 7px;
  margin-top: 30px;
`;

const DateWrapper = styled.View`
  margin: 5px 0px;
`;

const Subtitle = styled.Text`
  color: #3b414b;
  font-weight: 600;
  font-size: 16px;
  padding-bottom: 10px;
  margin-left: 0;
`;

const MiniSubtitle = styled.Text`
  color: #3b414b;
  font-weight: 600;
  font-size: 14px;
  padding-bottom: 5px;
  padding-top: 5px;
  margin-left: 0;
`;

const GrayWrapper = styled.View`
  width: 100%;
  border: 1px solid #00000010;
  padding: 10px 20px;
  border-radius: 5px;
  margin-bottom: 20px;
  flex: 1;
`;

const DateText = styled.Text`
  font-size: 16px;
  padding-left: 10px;
`;

const DateIconFlex = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  padding: 5px;
`;

const TitleButtonWrapper = styled.View`
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
  align-items: center;
`;

const ButtonEdit = styled.TouchableOpacity``;

const ButtonEditCentre = styled.TouchableOpacity`
  width: 100%;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: #4aaf6e;
`;

const BodyText = styled.Text`
  font-size: 14px;
`;

const GeneralWrapper = styled.View`
  width: 100%;
  padding: 15px 0px;
  flex: 1;
`;

const ModalView = styled.Modal`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.TouchableOpacity`
  background-color: #00000040;
  flex: 1;
`;

const TripTitle = styled.Text`
  color: #3b414b;
  font-weight: 600;
  font-size: 20px;
  margin-left: 0;
  text-align: ${(props) => (props.notCenter ? "left" : "center")};
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
  padding: 20px 20px;
  padding-bottom: 40px;
  border-top-width: 1px;
  border-top-color: #00000010;
`;

const ConfirmButton = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;

const ConfirmText = styled.Text`
  color: ${(props) => (props.color ? props.color : "#727d76")};
  font-size: 18px;
  font-weight: 500;
`;

const CancelText = styled.Text`
  color: ${(props) => (props.reset ? "#f74551" : "#727d76")};
  font-weight: ${props => props.reset ? "600" : "400"};
  font-size: 18px;
`;

const Footer = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  border-top-width: 1px;
  border-top-color: #00000020;
  padding: 20px 20px;
  padding-bottom: 40px;
`;

const WrapperPrice = styled.View`
  width: auto;
  align-items: flex-end;
`;

const WrapperPriceFix = styled.View`
  width: auto;
`;

const ContainerPrice = styled.View`
  flex: 1;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const TitlePrice = styled.Text`
  font-size: 18px;
  color: ${(props) => (props.color ? "#4aaf6e" : "#727d76")};
  font-weight: bold;
`;

const Price = styled.Text`
  color: ${(props) => (props.color ? "#4aaf6e" : "#727d76")};
`;

const ImageCars = styled.Image`
  width: 100%;
  height: 100%;
`;

const ModalMargin = styled.View`
  flex: 1;
  margin-top: auto;
  background-color: #fff;
  padding: 30px 0px;
`;

const TripDescription = styled.Text`
  color: #3b414b;
  font-weight: 400;
  font-size: 14px;
  margin-left: 0;
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

const CarDetails = ({ route, navigation }) => {

  const [microStartDate, setMicroStartDate] = useState();
  const [startMicroTempDate, setMicroTempStartDate] = useState("");
  const [startVehicleTempDate, setVehicleTempStartDate] = useState("");
  const [endVehicleTempDate, setVehicleTempEndDate] = useState("");
  const [timeDates, setTimeDates] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [modalView, setModalView] = useState(0);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(moment().startOf("month"));
  const [vehicle, setVehicle] = useState(false);
  const [checkedDates, setCheckedDates] = useState(false);
  const refCalendarPicker = useRef();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState([]);
  const [masterStart, setMasterStart] = useState('');
  const [masterEnd, setMasterEnd] = useState('');
  const refCalendarPickerMicro = useRef();

  //start
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = (reset) => {
    setDatePickerVisibility(false);
    if (reset) {
      handleReset();
    }
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

  const handleConfirm = () => {
    setStartDate(moment(startVehicleTempDate));
    setEndDate(moment(endVehicleTempDate));
    hideDatePicker();
  };

  const handleNext = () => {
    if (route.params.type == 'vehicle') {
      navigation.navigate("Confirm", {
        hotelId: route.params.hotelId,
        vehicleId: route.params.id,
        startDate: moment(startDate),
        endDate: moment(endDate),
      });
    } else {
      navigation.navigate("Confirm", {
        hotelId: route.params.hotelId,
        vehicleId: route.params.id,
        startDate: moment(masterStart),
        endDate: moment(masterEnd),
      });
    }

  };

  const handleTempConfirm = (date, type) => {
    if (route.params.type == "vehicle") {


      if(type === "END_DATE" && date != null) {
        setCheckedDates("");
        setVehicleTempEndDate(moment(date))
      } else if(type === "END_DATE" && date === null) {
        setVehicleTempEndDate("")
      }

      if(type === "START_DATE" && date != null) {
        setCheckedDates("");
        setVehicleTempStartDate(moment(date))
      } else if (type === "START_DATE" && date === null) {
        setVehicleTempStartDate("")
      }
      
    } else {
      setMicroTempStartDate(moment(date));
    }

    if (endVehicleTempDate && startVehicleTempDate) {
      setCheckedDates(
        checkDatesInRange(
          unavailableDates,
          endVehicleTempDate,
          startVehicleTempDate
        )
      );
    }
  };

  useEffect(() => {
    if (checkedDates) {
      refCalendarPicker.current.resetSelections();
    }
  }, [checkedDates]);

  async function fetchData() {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_VEHICLE(route.params.hotelId, route.params.id),
      undefined,
      undefined,
      true
    );

    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 404, vehicle prob doesnt exist or somthing
      //

      return res;
    } else {
      return res;
    }
  }

  async function fetchCalendar(hotelID, id, startDate, endDate) {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_VEHICLE_BOOKINGS(
        hotelID,
        id,
        moment(startDate).utc().toISOString(),
        moment(endDate).utc().toISOString()
      ),
      undefined,
      undefined,
      true
    );

    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 404, vehicle prob doesnt exist or somthing
      //
      return res;
    } else {
      return res;
    }
  }

  async function getActiveBooking() {
    let res = await RequestHandler(
      "GET",
      endpoints.GET_USER_BOOKINGS(true),
      undefined,
      undefined,
      true
    );

    if ("error" in res) {
      // SAHIL, HANDLE THIS
      // probably a 404, hotel/vehicle prob doesnt exist or somthing,
      // OR the hotel doesnt even have a box yet
      // or u could receive 403, so show the error message to user
      //
      return res;
    } else {
      // res.latch_id = Number
      // tell the user t expect their keys in "Latch #X"
      return res;
    }
  }

  const vehicleQuery = useQuery({
    queryKey: ["car"],
    queryFn: () => fetchData(),
    onSuccess: (data) => "error" in data ? setVehicle(false) : setVehicle(true),
  });

  const bookingQuery = useQuery({
    queryKey: [
      "calendar",
      vehicle && vehicleQuery.data.vehicle.hotel_id,
      vehicle && vehicleQuery.data.vehicle.id,
      moment(currentMonth).startOf("month"),
      moment(currentMonth).endOf("month"),
    ],
    queryFn: () =>
      fetchCalendar(
        vehicle && vehicleQuery.data.vehicle.hotel_id,
        vehicle && vehicleQuery.data.vehicle.id,
        moment(currentMonth).startOf("month"),
        moment(currentMonth).endOf("month")
      ),
    enabled: vehicle,
    onSuccess: (data) => console.log(data),
    onError: (data) => console.log(data)
  });

  const activeBooking = useQuery({
    queryKey: ["active"],
    queryFn: () => getActiveBooking(),
    cacheTime: 0,
  });

  function getDates(bookings) {
    let dates = [];
    if (bookings) {
      bookings.forEach((booking) => {
        let start = moment(booking.start_date).subtract(1, "days");
        let end = moment(booking.end_date).add(1, "days");
        for (let m = start; m.isSameOrBefore(end); m.add(1, 'days')) {
          dates.push(m.toDate());
        }
      });
    } else {
      return dates;
    }
    return dates;
  }

  useEffect(() => {
    if (vehicle) {
      bookingQuery.refetch();
    }
    setUnavailableDates(getDates(bookingQuery?.data?.bookings));
  }, [currentMonth, vehicle, bookingQuery.data]);

  useEffect(() => {
    if (route.params.startDate && route.params.endDate) {
      if (route.params.type == "vehicle") {
        setVehicleTempStartDate(moment(route.params.startDate));
        setVehicleTempEndDate(moment(route.params.startDate));
        setStartDate(moment(route.params.startDate));
        setEndDate(moment(route.params.endDate));
      } else {
        setMicroTempStartDate(route.params.startDate)
        setMicroStartDate(route.params.startDate)
        setSelectedTimeSlots(addTimeSlots(moment(route.params.startDate), moment(route.params.endDate)));
        setMasterStart(route.params.startDate)
        setMasterEnd(route.params.endDate)
      }
    }
  }, []);

  const addTimeSlots = (startDate, endDate) => {
    const selectedTimeSlots = [];

    let current = moment(startDate);
    const end = moment(endDate);

    while (current.isBefore(end)) {
      const next = current.clone().add(2, 'hours');
      selectedTimeSlots.push({
        start: current.format(),
        end: next.format(),
        markup: `${current.format("h:mma")} - ${next.format("h:mma")}`,
      });
      current = next;
    }

    return selectedTimeSlots;
  }




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

  function checkDatesInRange(dates, start, end) {
    for (let date of dates) {
      let d = new Date(date);
      if (d >= start && d <= end) {
        return true;
      }
    }
    return false;
  }

  const handleReset = () => {
    if (route.params.type == "vehicle") {
      setCheckedDates("");
      refCalendarPicker.current.resetSelections();
    }

    if (route.params.type == "micro_mobility") {
      refCalendarPickerMicro.current.resetSelections();
    }
    setVehicleTempStartDate("");
    setVehicleTempEndDate("");
    setSelectedTimeSlots([])
    setMasterStart('')
    setMasterEnd('')
    setStartDate("");
    setEndDate("");
    setMicroTempStartDate("");
  };

  useEffect(() => {
  }, [masterStart])

  let main = null;
  if (vehicleQuery.isLoading) {
    main = <CarLoad />;
  } else if (vehicleQuery.isError) {
    main = (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <Title>An Internal Error has Occured. Please Try Again Later.</Title>
        </View>
      </View>
    );
  } else {
    main = (
      <View style={{ flex: 1 }}>
        {
        "error" in vehicleQuery.data ?
        <View style={{
          padding: 20,
          paddingTop: 50,
          backgroundColor: "#00000050"
        }}>

        <Title>{vehicleQuery.data.error.message}</Title>
        </View>
        :
        vehicleQuery.data.vehicle ? (
          <View style={{ flex: 1 }}>
            <ScrollView
              scrollIndicatorInsets={{ right: 1 }}
              style={{ flex: 1, width: "100%" }}
            >
              <ModalView
                visible={isDatePickerVisible}
                transparent={true}
                animationType="slide"
              >
                
                <ModalContent activeOpacity={1}>
                  <ModalMargin onPress={() => null} activeOpacity={1}>
                    <View
                      style={{
                        flexDirection: "row",
                        paddingLeft: 15,
                        paddingRight: 15,
                        width: "100%",
                        paddingTop: 70,
                        paddingBottom: 7,
                        justifyContent: "space-between",
                      }}
                    >
                      {route.params.type == "micro_mobility" ? (
                        <View
                          style={{
                            flex: 1,
                            paddingRight: 5,
                          }}
                        >
                          {modalView == 0 ? (
                            <TripTitle notCenter>
                              Step 1: Select a Date
                            </TripTitle>
                          ) : (
                            <TripTitle notCenter>
                              Step 2: Select a Time
                            </TripTitle>
                          )}
                        </View>
                      ) : (
                        <TripTitle>Select your Trip Dates</TripTitle>
                      )}
                      <View style={{}}>
                        <Ionicons
                          onPress={() => {
                            if (modalView == 1) {
                              hideDatePicker();
                            } else {
                              hideDatePicker(true);
                            }
                          }}
                          name={"close-circle"}
                          size={24}
                          color={"#3B414B"}
                        ></Ionicons>
                      </View>
                    </View>

                    {route.params.type == "micro_mobility" ? (
                      //Micro Mobility
                      <View
                        style={{
                          paddingLeft: 15,
                          paddingRight: 15,
                        }}
                      >
                        <TripDescription>
                          Micro Mobility vehicles are only available for up to 1
                          day at a time. Please select your booking date and
                          then, a time slot you will be renting from.
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
                          Micro Mobility vehicles are only available for up to 1
                          day at a time. Select up to 3 time slots.
                        </TripDescription>
                      </View>
                    )}

                    <SeperatorFull></SeperatorFull>

                    {route.params.type == "micro_mobility" ? (
                      //if Selection Micro Mobility

                      modalView == 0 ? (
                        //if screen 1
                        
                        <CalendarPicker
                          onDateChange={handleTempConfirm}
                          allowRangeSelection={false}
                          minDate={moment()}
                          selectedDayColor="#4aaf6e"
                          selectedDayTextColor="#FFFFFF"
                          previousTitle="Back"
                          maxDate={moment().add(1, 'month').subtract(1, 'day')}
                          ref={refCalendarPickerMicro}
                          dayLabelsWrapper={{
                            borderColor: "#FFF",
                          }}
                          selectedStartDate={microStartDate}
                          onMonthChange={(date) => {
                            setCurrentMonth(date)
                          }}

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
                              {moment(startMicroTempDate).format(
                                "dddd, MMMM, Do YYYY"
                              )}
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
                            <FlatList
                              style={{
                                paddingTop: 10,
                              }}
                              data={timeDates}
                              keyExtractor={(item, index) => index.toString()}
                              renderItem={({ item }) => {
                                let isBooked = false;
                                let start = moment(item.start).format();
                                let end = moment(item.end).format();
                                bookingQuery.data.bookings && bookingQuery.data?.bookings?.forEach((booking) => {
                                  if (moment(booking.start_date).isSame(start) && moment(booking.end_date).isSame(end)) {
                                    isBooked = true;
                                  }
                                });

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
                                        disabled={isBooked}
                                        booked={isBooked}
                                        selected={selectedTimeSlots.findIndex(selected => moment(selected.start).isSame(moment(item.start))) !== -1}
                                        onPress={() => {
                                          onSelectTimeSlot(item.markup, item.start, item.end)
                                        }}
                                      >
                                        <DateText>{item.markup}</DateText>
                                      </DateItem>
                                    )}
                                  </View>
                                );
                              }}
                            />
                          </View>
                        </View>
                      )
                    ) : (
                      //if selection is vehicles
                      
                      <CalendarPicker
                        onDateChange={handleTempConfirm}
                        allowRangeSelection={true}
                        minDate={moment()}
                        selectedDayColor={"#4aaf6e"}
                        selectedDayTextColor="#FFFFFF"
                        previousTitle="Back"
                        ref={refCalendarPicker}
                        dayLabelsWrapper={{
                          borderColor: "#FFF",
                        }}
                        selectedStartDate={startDate}
                        selectedEndDate={endDate}
                        disabledDates={unavailableDates}
                        selectedDisabledDatesTextStyle={{
                          color: "#FF0000",
                        }}
                        customDatesStyles={{
                          textStyle: { color: "#fad" },
                        }}
                        onMonthChange={(date) => {
                          setCurrentMonth(date)
                        }}
                        maxDate={moment().add(1, 'month').subtract(1, 'day')}
                        maxRangeDuration={7}
                      />
                    )}

                    {/* //Buttons */}
                    {route.params.type == "micro_mobility" ? (
                      //micro mobility
                      modalView == 0 ? (
                        <WrapperFlex>
                          <ConfirmButton onPress={() => hideDatePicker(true)}>
                            <CancelText>Cancel</CancelText>
                          </ConfirmButton>
                          {startMicroTempDate ? (
                            <ConfirmButton
                              onPress={() => {
                                setMicroStartDate(startMicroTempDate);
                                setModalView(1);
                              }}
                            >
                              <ConfirmText color={"#4aaf6e"}>Next</ConfirmText>
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
                          {masterStart && masterEnd ? (
                            <ConfirmButton
                              onPress={() => {
                                setModalView(0);
                                hideDatePicker();
                              }}
                            >
                              <ConfirmText color={"#4aaf6e"}>Next</ConfirmText>
                            </ConfirmButton>
                          ) : (
                            <ConfirmButton>
                              <ConfirmText>Next</ConfirmText>
                            </ConfirmButton>
                          )}
                        </WrapperFlex>
                      )
                    ) : //vehicles
                      !startVehicleTempDate && !endVehicleTempDate ? (
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
                          <ConfirmButton
                            onPress={() => {
                              handleReset();
                            }}
                          >
                            <CancelText reset>Reset</CancelText>
                          </ConfirmButton>

                          {startVehicleTempDate && endVehicleTempDate ? (
                            checkDatesInRange(
                              unavailableDates,
                              startVehicleTempDate,
                              endVehicleTempDate
                            ) ? (
                              <ConfirmButton>
                                <ConfirmText color={"#FF0000"}>
                                  Please Select Available Dates
                                </ConfirmText>
                              </ConfirmButton>
                            ) : (
                              <ConfirmButton onPress={() => handleConfirm()}>
                                <ConfirmText color={"#4aaf6e"}>
                                  Confirm
                                </ConfirmText>
                              </ConfirmButton>
                            )
                          ) : (
                            <ConfirmButton>
                              <ConfirmText>Confirm</ConfirmText>
                            </ConfirmButton>
                          )}
                        </WrapperFlex>
                      )}
                  </ModalMargin>
                </ModalContent>
              </ModalView>

              <WrapperImage>
                <Swiper
                  showsPagination={false}
                  showsButtons={true}
                  nextButton={
                    <Ionicons
                      name={"chevron-forward"}
                      size={32}
                      color={"#fff"}
                    ></Ionicons>
                  }
                  prevButton={
                    <Ionicons
                      name={"chevron-back"}
                      size={32}
                      color={"#fff"}
                    ></Ionicons>
                  }
                >
                  {vehicleQuery.data.vehicle.image_urls.map((e) => {
                    return (
                      <View style={{ flex: 1 }}>
                        <ImageCars
                          resizeMode="cover"
                          source={{ uri: e }}
                        ></ImageCars>
                      </View>
                    );
                  })}
                </Swiper>
              </WrapperImage>

              <Container>
                <GeneralWrapper>
                  <Title>{vehicleQuery.data.vehicle.model}</Title>
                  <BodyText>{vehicleQuery.data.vehicle.description}</BodyText>
                </GeneralWrapper>
                <GeneralWrapper>
                  <Subtitle>Trip Dates</Subtitle>
                  {route.params.type == "vehicle" ? (
                    startDate == "" ? (
                      <GrayWrapper>
                        <ButtonEditCentre
                          onPress={showDatePicker}
                          style={{ padding: 10, borderColor: "#4aaf6e" }}
                        >
                          <Ionicons
                            style={{ marginRight: 10 }}
                            name={"calendar-outline"}
                            size={16}
                            color={"#4aaf6e"}
                          ></Ionicons>
                          <ButtonText>Select your Trip Dates</ButtonText>
                        </ButtonEditCentre>
                      </GrayWrapper>
                    ) : (
                      <GrayWrapper>
                        <DateWrapper>
                          <TitleButtonWrapper>
                            <MiniSubtitle>Start Date</MiniSubtitle>
                            <ButtonEdit onPress={showDatePicker}>
                              <ButtonText>Change</ButtonText>
                            </ButtonEdit>
                          </TitleButtonWrapper>
                          <DateIconFlex>
                            <Ionicons
                              name={"calendar-outline"}
                              size={16}
                              color={"#3B414B"}
                            ></Ionicons>
                            <DateText>
                              {moment(startDate).format("LLL")}
                            </DateText>
                          </DateIconFlex>
                        </DateWrapper>
                        <DateWrapper>
                          <TitleButtonWrapper>
                            <MiniSubtitle>End Date</MiniSubtitle>
                          </TitleButtonWrapper>
                          <DateIconFlex>
                            <Ionicons
                              name={"calendar-outline"}
                              size={16}
                              color={"#3B414B"}
                            ></Ionicons>
                            <DateText>{moment(endDate).format("LLL")}</DateText>
                          </DateIconFlex>
                        </DateWrapper>
                        <DateWrapper>
                          <MiniSubtitle>Duration</MiniSubtitle>
                          <DateIconFlex>
                            <Ionicons
                              name={"car-outline"}
                              size={16}
                              color={"#3B414B"}
                            ></Ionicons>
                            {moment(endDate).diff(startDate, "days") >= 1 ? (
                              <DateText>
                                {moment(endDate).diff(startDate, "days")} days
                              </DateText>
                            ) : (
                              <DateText>
                                {moment(endDate).diff(startDate, "hours")} hours
                              </DateText>
                            )}
                          </DateIconFlex>
                        </DateWrapper>
                      </GrayWrapper>
                    )
                  ) : masterStart == "" ? (
                    <GrayWrapper>
                      <ButtonEditCentre
                        onPress={showDatePicker}
                        style={{ padding: 10, borderColor: "#4aaf6e" }}
                      >
                        <Ionicons
                          style={{ marginRight: 10 }}
                          name={"calendar-outline"}
                          size={16}
                          color={"#4aaf6e"}
                        ></Ionicons>
                        <ButtonText>Select your Trip Dates</ButtonText>
                      </ButtonEditCentre>
                    </GrayWrapper>
                  ) : (
                    <GrayWrapper>
                      <DateWrapper>
                        <TitleButtonWrapper>
                          <MiniSubtitle>Start Date</MiniSubtitle>
                          <ButtonEdit onPress={showDatePicker}>
                            <ButtonText>Change</ButtonText>
                          </ButtonEdit>
                        </TitleButtonWrapper>
                        <DateIconFlex>
                          <Ionicons
                            name={"calendar-outline"}
                            size={16}
                            color={"#3B414B"}
                          ></Ionicons>
                          <DateText>
                            {moment(masterStart).format("LLL")}
                          </DateText>
                        </DateIconFlex>
                      </DateWrapper>
                      <DateWrapper>
                        <TitleButtonWrapper>
                          <MiniSubtitle>End Date</MiniSubtitle>
                        </TitleButtonWrapper>
                        <DateIconFlex>
                          <Ionicons
                            name={"calendar-outline"}
                            size={16}
                            color={"#3B414B"}
                          ></Ionicons>
                          <DateText>
                            {moment(masterEnd).format("LLL")}
                          </DateText>
                        </DateIconFlex>
                      </DateWrapper>
                      <DateWrapper>
                        <MiniSubtitle>Duration</MiniSubtitle>
                        <DateIconFlex>
                          <Ionicons
                            name={"car-outline"}
                            size={16}
                            color={"#3B414B"}
                          ></Ionicons>
                          {moment(masterEnd).diff(
                            masterStart,
                            "days"
                          ) >= 1 ? (
                            <DateText>
                              {moment(masterEnd).diff(
                                masterStart,
                                "days"
                              )}{" "}
                              days
                            </DateText>
                          ) : (
                            <DateText>
                              {moment(masterEnd).diff(
                                masterStart,
                                "hours"
                              )}{" "}
                              hour
                            </DateText>
                          )}
                        </DateIconFlex>
                      </DateWrapper>
                    </GrayWrapper>
                  )}
                  <GeneralWrapper>
                    <Subtitle>Price</Subtitle>
                    <GrayWrapper>
                      <DateWrapper>
                        {
                          route.params.type == 'vehicle' ?
                            <MiniSubtitle>Rate Per Day</MiniSubtitle>
                            :
                            <MiniSubtitle>Rate Per Hour</MiniSubtitle>

                        }
                        <DateIconFlex>
                          <Ionicons
                            name={"pricetag-outline"}
                            size={16}
                            color={"#3B414B"}
                          ></Ionicons>
                          <DateText>
                            ${vehicleQuery.data.vehicle.rate.toFixed(2)}
                          </DateText>
                        </DateIconFlex>
                      </DateWrapper>
                      <DateWrapper>
                        <MiniSubtitle
                          style={{ color: "#4aaf6e", fontWeight: "700" }}
                        >
                          Sub Total
                        </MiniSubtitle>

                        {(route.params.type == "vehicle" ? (
                          startDate ?
                            <DateIconFlex>
                              <Ionicons
                                name={"cash-outline"}
                                size={16}
                                color={"#4aaf6e"}
                              ></Ionicons>
                              <DateText
                                style={{ color: "#4aaf6e", fontWeight: "700" }}
                              >
                                $
                                {(vehicleQuery.data.vehicle.rate *
                                  moment(endDate).diff(startDate, "days")).toFixed(2)}
                                {" "}USD
                              </DateText>
                            </DateIconFlex>

                            :
                            <DateIconFlex>
                              <Ionicons
                                name={"cash-outline"}
                                size={16}
                                color={"#3B414B"}
                              ></Ionicons>
                              <DateText>Select a Date to Reveal</DateText>
                            </DateIconFlex>
                        ) : (
                          masterStart ?
                          <DateIconFlex>
                            <Ionicons
                              name={"cash-outline"}
                              size={16}
                              color={"#4aaf6e"}
                            ></Ionicons>
                            <DateText
                              style={{ color: "#4aaf6e", fontWeight: "700" }}
                            >
                              $
                              {
                                vehicleQuery.data.vehicle.rate.toFixed(2) *
                                moment(masterEnd).diff(
                                  masterStart,
                                  "hours"
                                ).toFixed(2)
                              }
                            </DateText>
                          </DateIconFlex>
                          :
                          <DateIconFlex>
                              <Ionicons
                                name={"cash-outline"}
                                size={16}
                                color={"#3B414B"}
                              ></Ionicons>
                              <DateText>Select a Date to Reveal</DateText>
                            </DateIconFlex>
                        )
                        )}
                      </DateWrapper>
                    </GrayWrapper>
                  </GeneralWrapper>
                </GeneralWrapper>
              </Container>
            </ScrollView>
            <Footer>
              {/* <ButtonEdit style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    }}>
        <Ionicons style={{marginRight: 3}} name={'chevron-back'} size={16} color={'#727d76'}></Ionicons>
    <ButtonText
    style={{color: '#727d76'}}
    >Back</ButtonText></ButtonEdit> */}
              {route.params.type == "vehicle" ? (
                startDate == "" ? (
                  <ContainerPrice>
                    <WrapperPriceFix>
                      <TitlePrice color>
                        ${vehicleQuery.data.vehicle.rate.toFixed(2)} Per Day
                      </TitlePrice>
                      <Price color>Select your Trip Dates</Price>
                    </WrapperPriceFix>
                    <WrapperPrice style={{ marginLeft: 10 }}>
                      <Ionicons
                        name={"arrow-forward"}
                        size={32}
                        color={endDate == "" ? "#c6cacf" : "#4aaf6e"}
                      ></Ionicons>
                    </WrapperPrice>
                  </ContainerPrice>
                ) : (
                  <ContainerPrice>
                    <WrapperPriceFix>
                      <TitlePrice color>
                        ${vehicleQuery.data.vehicle.rate.toFixed(2)} Per Hour
                      </TitlePrice>
                      <Price color>
                        $
                        {vehicleQuery.data.vehicle.rate.toFixed(2) *
                          moment(endDate).diff(startDate, "days")}{" "}
                        est. total
                      </Price>
                    </WrapperPriceFix>

                    <WrapperPrice style={{ marginLeft: 20 }}>
                      <CustomButton
                        width={"120px"}
                        bgcolor={"#4aaf6e"}
                        fcolor="#fff"
                        title={"Next"}
                        rad
                        onPress={() => handleNext()}
                      ></CustomButton>
                    </WrapperPrice>
                  </ContainerPrice>
                )
              ) : (
                masterStart == "" ?
                  <ContainerPrice>
                    <WrapperPriceFix>
                      <TitlePrice color>
                        ${vehicleQuery.data.vehicle.rate.toFixed(2)} Per Day
                      </TitlePrice>
                      <Price color>Select your Trip Dates</Price>
                    </WrapperPriceFix>
                    <WrapperPrice style={{ marginLeft: 10 }}>
                      <Ionicons
                        name={"arrow-forward"}
                        size={32}
                        color={endDate == "" ? "#c6cacf" : "#4aaf6e"}
                      ></Ionicons>
                    </WrapperPrice>
                  </ContainerPrice>
                  :
                  <ContainerPrice>
                    <WrapperPriceFix>
                      <TitlePrice color>
                        ${vehicleQuery.data.vehicle.rate.toFixed(2)} Per Hour
                      </TitlePrice>

                      <Price color>
                        $
                        {vehicleQuery.data.vehicle.rate.toFixed(2) *
                          moment(masterEnd).diff(
                            masterStart,
                            "hours"
                          )}{" "}
                        est. total
                      </Price>
                    </WrapperPriceFix>

                    <WrapperPrice style={{ marginLeft: 20 }}>
                      <CustomButton
                        width={"120px"}
                        bgcolor={"#4aaf6e"}
                        fcolor="#fff"
                        title={"Next"}
                        rad
                        onPress={() => handleNext()}
                      ></CustomButton>
                    </WrapperPrice>
                  </ContainerPrice>
              )}
            </Footer>
          </View>
        )
        
        : (
          <></>
        )}
      </View>
    );
  }

  return main;
};

export default CarDetails;
