<!-- Add Paystack script in <head> -->
<script src="https://js.paystack.co/v1/inline.js"></script>

<!-- Your Buy Button -->
<button type="button" onclick="payWithPaystack()" 
        style="width:100%; background:#111; color:#fff; padding:15px; border:none; 
               border-radius:10px; font-size:18px; font-weight:bold; cursor:pointer;">
  Pay with Card / MoMo
</button>

<script>
function payWithPaystack(){
  var network = document.querySelector('input[name="network"]:checked').value;
  var bundle = document.getElementById("bundle").value;
  var phone = document.getElementById("phone").value;
  var amount = 500; // GHS 5.00 = 500 pesewas. Change based on bundle selected

  var handler = PaystackPop.setup({
    key: 'pk_test_xxx', // Replace with your Live key later
    email: 'customer@email.com', // you can add email field
    amount: amount,
    currency: "GHS",
    ref: ''+Math.floor((Math.random() * 1000000) + 1), // unique reference
    metadata: {
      custom_fields: [
        {display_name: "Network", value: network},
        {display_name: "Bundle", value: bundle},
        {display_name: "Phone", value: phone}
      ]
    },
    callback: function(response){
      alert('Payment successful! Reference: ' + response.reference);
      // Send response.reference to your backend to deliver bundle
    },
    onClose: function(){
      alert('Payment cancelled');
    }
  });
  handler.openIframe();
}
</script>
