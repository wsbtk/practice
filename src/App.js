import 'bootstrap/dist/css/bootstrap.min.css';
import React, { Component } from 'react'
import './App.css'
import axios from 'axios'

var map;
// var infowindow;
//var marker;
//var markers = []
//var marker = ''
//var infowindows = []

class App extends Component {
  state = {
    restaurants: [],
    filteredRestaurants: [],
    allFilteredRestaurants: [],
    //inverseRestaurants: [],
    // infowindows: [],
    // infowindow: null,
    // markers: [],
    // filteredMarkers: [],
    // marker: ''
    //isVisible: false
  }

  componentDidMount() {
    this.getRestaurants();
  }

  renderMap = () => {    
    loadScript("https://maps.googleapis.com/maps/api/js?key=&callback=initMap")
    //AIzaSyD1DrDBUd6GNL2EIBCxK-K0OjkTny8kbuA
    window.initMap = this.initMap
  }

  getRestaurants = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "503SSLTFBQE5VYVQAM1FZSBGHHPG0OFXB1TC5QI5BWS33ZLZ",
      //"PMHC2WA1VCBHVYOPPSJ0QSBYTLRF4PNJ04OWVWV0PZJ0QFIR",
      client_secret: "GGHRZNCAO4OTK4IYKFK51YJ4HHVUC3OWJA1Q3W2NJOFZV0K1",
      //"CULSZZ44YAEBOWBFGPB4BF5ISRXXSNYR0EE3JV3CNE2ZWHV0",
      query: "restaurant",
      near: "Atlanta",
      v: "20182507",
      limit: "5"      
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          restaurants: response.data.response.groups[0].items,
          filteredRestaurants: response.data.response.groups[0].items,
          allFilteredRestaurants: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        console.log("ERROR!! " + error)
      })
  }

  initMap = () => {
    //Create A Map
    map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 33.7758577, lng: -84.398572},
      zoom: 13
    })
    //var marker;
    // Create An InfoWindow
    var infowindow = new window.google.maps.InfoWindow()
    //var contentString;
    // Display Dynamic Markers
    this.state.restaurants.map(restaurant => {
      //console.log(restaurant)
      var contentString = `${restaurant.venue.name} <br> ${restaurant.venue.location.address}, ${restaurant.venue.location.city}` 

      // Create A Marker
      var marker = new window.google.maps.Marker({
        position: {lat: restaurant.venue.location.lat , lng: restaurant.venue.location.lng},
        map: map,
        title: restaurant.venue.name,
        animation: window.google.maps.Animation.DROP
        
      })
      //marker.setVisible(true)
      //console.log(marker);
      //this.state.markers.push(marker);
      //console.log(markers);
      
        //Click on A Marker!
        marker.addListener('click', function() {
        // Change the content
        infowindow.setContent(contentString)
        // Open An InfoWindow
        infowindow.open(map, marker)
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function () {
          marker.setAnimation(null);}, 700);        
       })
    })
    //console.log (this.state.markers);
    // console.log(this.state.filteredRestaurants);
  }

  handleFilter = (newFilter) => {
   // console.log(newFilter);
    // console.log(newFilter.length)
    if (newFilter.length > 0) {
      this.setState(() => ({
        filteredRestaurants: 
        this.state.filteredRestaurants.filter(restaurant => restaurant.venue.name.toLowerCase().includes(newFilter.toLowerCase()))
        // filteredMarkers:
        // this.state.filteredRestaurants.filter(marker => 
        //   marker = new window.google.maps.Marker({
        //     position: {lat: marker.venue.location.lat , lng: marker.venue.location.lng},
        //     map: map,
        //     //title: key.venue.location.name,
        //     //address: myVenue.venue.location.address
        //   }
          
        //   )
        // )
         
      }));
      

      //this.state.filteredRestaurants.marker.setVisible(true)
      //console.log(this);
    } else {
      this.setState(() => ({
        filteredRestaurants: this.state.allFilteredRestaurants
      }));
      //filteredMarker();
    }
  };

  // updateQuery(query, infowindow) {
  //   let workingList = this.state.workingList
  //   let locations = this.state.locations
  //   let markers = this.state.markers
  //   this.setState({ query })//or query.trim()
  //   markers.forEach(marker => marker.setVisible(true))//turn markers on

  //   if (query) {
  //     this.state.infowindow === null ? null :
  //       this.state.infowindow !== null ? this.state.infowindow.close(map, marker) : null;

  //     const match = new RegExp(escapeRegExp(query), 'i')
  //     workingList = locations.filter(location => match.test(location.name))
  //     //Loop through both arrays an return an array with markers not represented by markers
  //     const notVisible = markers.filter(marker =>
  //       workingList.every(place => place.id !== marker.id)
  //     )
  //     notVisible.forEach(marker => marker.setVisible(false)) // turn them off
  //   } else { workingList = locations }
  //   this.setState({ workingList })
  // }
  // var a = someArr.filter(e => !someFilter(e));
  // inverseFilter = 

  render() {
    return (
      <main>       
      <div className = "container-full-width">
      <div className="d-flex">
        <div className="options-box">
          <h1>Restaurant Finder Near Atlanta</h1>
          <div>
          <Filter handleFilter={this.handleFilter} />
          
            {this.state.filteredRestaurants.map((restaurant) => (
              
              <div className="list-group">
                <ul 
                    aria-label = 'List of Restaurants'>                  
                      <button type="button" className="list-group-item list-group-item-action"
                          onClick = {() => {readMap(restaurant)
                          }}> 
                            {restaurant.venue.name}
                                                       
                      </button>
                                          
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div >
        <div id="map"></div>
        </div>
      </div>
    </div>
      </main>
    )
  }
}
//Search Function
const Filter = (props) => (
  <div className= "filter-list">
    <input 
        id='form-control' 
        type='text' 
        className='input'
        placeholder='Enter a Restaurant Name' 
        aria-label="text filter"
        name="filter"
        onChange={(e) => {
          props.handleFilter(e.target.value); 
        }}/>
  </div>
  );
//Search FUnction Ends

// var infowindow;
function readMap(key)
{
  console.log(key);
  var infowindow = new window.google.maps.InfoWindow()
  // var map = new window.google.maps.Map(document.getElementById('map'), {
  //   center: {lat: 33.7758577, lng: -84.398572},
  //   zoom: 13
  // })
        // Create A Marker
        var marker = new window.google.maps.Marker({
          position: {lat: key.venue.location.lat , lng: key.venue.location.lng},
          map: map,
          //title: key.venue.location.name,
          //address: myVenue.venue.location.address
        })
        // marker.setVisible(false);
        infowindow.setContent(key.venue.name +`<br>`+ key.venue.location.address+',' +' '+ key.venue.location.city) 
        
        // Open An InfoWindow
        infowindow.open(map, marker)
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        setTimeout(function () {
          marker.setAnimation(null);}, 700);
}

function loadScript(url) {
  var index  = window.document.getElementsByTagName("script")[0]
  var script = window.document.createElement("script")
  script.src = url
  script.async = true
  script.defer = true
  index.parentNode.insertBefore(script, index)
}

export default App;
