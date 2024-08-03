function initialize() {
    const input = document.getElementById('place');
    const suggestionsContainer = document.createElement('div');
    suggestionsContainer.setAttribute('id', 'suggestions-container');
    suggestionsContainer.style.position = 'absolute';
    suggestionsContainer.style.border = '1px solid #ccc';
    suggestionsContainer.style.backgroundColor = '#fff';
    suggestionsContainer.style.zIndex = '1000';
    suggestionsContainer.style.width = input.offsetWidth + 'px';
    suggestionsContainer.style.top = (input.offsetTop + input.offsetHeight) + 'px';
    suggestionsContainer.style.left = input.offsetLeft + 'px';
    input.parentNode.appendChild(suggestionsContainer);
  
    input.addEventListener('input', function() {
      const query = input.value;
      if (query.length > 0) {
        fetch(`https://api.geoapify.com/v1/geocode/autocomplete?text=${query}&type=city&limit=3&apiKey=c44a8336e20a48dd9351252b51dd3a54`)
          .then(response => response.json())
          .then(data => {
            suggestionsContainer.innerHTML = '';
            const suggestions = data.features.map(feature => {
              const city = feature.properties.city;
              const state = feature.properties.state;
              const country = feature.properties.country;
              const lat = feature.properties.lat;
              const lon = feature.properties.lon;
              return { city, state, country, lat, lon };
            });
            suggestions.forEach(suggestion => {
              const suggestionItem = document.createElement('div');
              suggestionItem.textContent = `${suggestion.city}, ${suggestion.state}, ${suggestion.country}`;
              suggestionItem.style.padding = '8px';
              suggestionItem.style.cursor = 'pointer';
              suggestionItem.addEventListener('click', function() {
                input.value = `${suggestion.city}, ${suggestion.state}, ${suggestion.country}`;
                console.log(`Coordinates: ${suggestion.lat}, ${suggestion.lon}`);
                suggestionsContainer.innerHTML = '';
              });
              suggestionsContainer.appendChild(suggestionItem);
            });
          });
      } else {
        suggestionsContainer.innerHTML = '';
      }
    });
  
    document.addEventListener('click', function(event) {
      if (event.target !== input) {
        suggestionsContainer.innerHTML = '';
      }
    });
  }
  
  document.addEventListener('DOMContentLoaded', initialize);
  