/*global google*/
import React from "react";
import TextField from "@mui/material/TextField";
import { Typography } from '@mui/material';
import { GoogleMap, StandaloneSearchBox, Marker } from "@react-google-maps/api";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';

let markerArray = [];
class LocationInput extends React.Component {


    constructor(props) {
        super(props);

        this.state = {
            currentLocation: { lat: 0, lng: 0 },
            markers: [],
            bounds: null,
            inputValue: "",
            filteredOptions: [],
            options: localStorage.getItem("autocompleteOptions")
                ? JSON.parse(localStorage.getItem("autocompleteOptions"))
                : [],
        };

        this.addOption = this.addOption.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
    }

    addOption(option) {
        this.setState({ options: [...this.state.options, option] }, () => {
            localStorage.setItem(
                "autocompleteOptions",
                JSON.stringify(this.state.options)
            );
        });
    }

    handleInputChange(e) {
        const userInput = e.target.value;
        this.setState({ inputValue: userInput });
        const filteredOptions = this.state.options.filter(
            (option) => option.toString().toLowerCase().indexOf(userInput.toString().toLowerCase()) > -1
        );
        this.setState({ filteredOptions });
    }

    handleKeyDown(e) {
        if (e.keyCode === 13) {
          const userInput = e.target.value;
          this.addOption(userInput);
          this.setState({ inputValue: "" });
        }
      }

    onMapLoad = map => {
        navigator?.geolocation.getCurrentPosition(
            ({ coords: { latitude: lat, longitude: lng } }) => {
                const pos = { lat, lng };
                this.setState({ currentLocation: pos });
            }
        );
        google.maps.event.addListener(map, "bounds_changed", () => {
            console.log(map.getBounds());
            this.setState({ bounds: map.getBounds() });
        });
    };

    onSBLoad = ref => {
        this.searchBox = ref;
    };

    onPlacesChanged = () => {
        markerArray = [];
        let results = this.searchBox.getPlaces();
        for (let i = 0; i < results.length; i++) {
            let place = results[i].geometry.location;
            markerArray.push(place);
        }
        this.addOption(markerArray);
        this.setState({ markers: markerArray });
        console.log(markerArray);
    };

    render() {
        return (
            <div>
                <div id="searchbox" style={{ marginTop: "50px" }}>

                    <Typography variant="h3">Welcome to Google Place Map</Typography>

                    <div style={{ marginTop: "10px" }}>
                    <Typography variant="h5">By Lum Hui Yen</Typography>
                    </div>

                    <StandaloneSearchBox
                        onLoad={this.onSBLoad}
                        onPlacesChanged={this.onPlacesChanged}
                        bounds={this.state.bounds}
                    >
                        <div alignContent='center' style={{ marginTop: "50px" }}>
                            <TextField
                                type="text"
                                placeholder="Search for a place"
                                style={{
                                    boxSizing: `border-box`,
                                    border: `1px solid transparent`,
                                    width: "50%",
                                    height: `100px`,
                                    borderRadius: `3px`,
                                    fontSize: `14px`,
                                    outline: `none`,
                                    textOverflow: `ellipses`,
                                    alignContent: "center"
                                }}
                        onChange={this.handleInputChange}
                        onKeyDown={this.handleKeyDown}
                        value={this.userInput}
                            />
                        </div>
                    </StandaloneSearchBox>
                </div>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <GoogleMap
                        center={this.state.currentLocation}
                        zoom={10}
                        onLoad={map => this.onMapLoad(map)}
                        mapContainerStyle={{ height: "500px", width: "500px", }}
                    >
                        {this.state.markers.map((mark, index) => (
                            <Marker key={index} position={mark} />
                        ))}
                    </GoogleMap>
                </div>
                <div style={{ marginTop: "50px" }}>
                <Typography variant="h6">Recent Searches</Typography>
                <List className="autocomplete-results">
                        {this.state.inputValue.length > 0 && this.state.filteredOptions.map((option) => (
                                <ListItem
                                    key={option}
                                    onClick={() =>
                                        this.setState({ inputValue: option, filteredOptions: [] })
                                    }
                                >
                                    <ListItemText>
                                    {option}
                                    </ListItemText>
                                </ListItem>
                            ))}
                </List>
                </div>
            </div>
        );
    }
}

export default LocationInput;
