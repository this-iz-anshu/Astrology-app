document.getElementById('kundliForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const formData = new FormData(this);
  const data = {
      name: formData.get('name'),
      dob: formData.get('dob'),
      time: formData.get('time'),
      place: formData.get('place')
  };
  
  fetch('/api/generate-kundli', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  .then(response => {
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      return response.json();
  })
  .then(data => {
      console.log('Server response:', data); // Log the response
      if (data.redirectUrl) {
          window.location.href = data.redirectUrl;
      } else {
          const resultDiv = document.getElementById('kundliResult');
          resultDiv.innerText = 'Error generating Kundli. Please try again later.';
      }
  })
  .catch(error => {
      console.error('Error:', error);
      const resultDiv = document.getElementById('kundliResult');
      resultDiv.innerText = 'Error generating Kundli. Please try again later.';
  });
});
