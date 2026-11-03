import {predictTrip,validateTrip,haversineKm,INPUT_NAMES} from './predictor.js';

const PRESETS={
  A:{vendor_id:1,passenger_count:2,pickup_month:2,pickup_dayofweek:5,pickup_hour:14,pickup_minute_bucket:30,pickup_lon_approx:-73.96,pickup_lat_approx:40.78,dropoff_lon_approx:-73.96,dropoff_lat_approx:40.76,straight_line_km_approx:1.5,store_and_fwd_flag:'N'},
  B:{vendor_id:1,passenger_count:1,pickup_month:2,pickup_dayofweek:3,pickup_hour:18,pickup_minute_bucket:15,pickup_lon_approx:-73.86,pickup_lat_approx:40.77,dropoff_lon_approx:-73.98,dropoff_lat_approx:40.76,straight_line_km_approx:10,store_and_fwd_flag:'N'}
};
const $=id=>document.getElementById(id);
const form=$('trip-form');
const predictButton=$('predict-btn');
let model=null;
let latestResult=null;

function updateStatus(message,type='loading'){
  const el=$('model-status');el.dataset.state=type;
  $('model-status-text').textContent=message;
}
function setNotice(text,type='error'){
  const el=$('form-notice');el.textContent=text;el.className=`notice ${type}`;
  el.hidden=!text;
}
function readForm(){
  const x={};
  for (const key of INPUT_NAMES){
    const input=$(key);
    x[key]=key==='store_and_fwd_flag'?input.value:Number(input.value);
  }
  return x;
}
function loadPreset(name){
  const values=PRESETS[name];
  for (const [key,value] of Object.entries(values))$(key).value=value;
  $('preset-a').classList.toggle('chosen',name==='A');
  $('preset-b').classList.toggle('chosen',name==='B');
  setNotice('');
  $('result-panel').classList.remove('visible');
  $('result-empty').hidden=false;
  $('result-panel').hidden=true;
  latestResult=null;
}
function formatSeconds(value){return new Intl.NumberFormat('vi-VN',{maximumFractionDigits:1,minimumFractionDigits:1}).format(value)}
function renderResult(seconds,input){
  latestResult=seconds;
  $('result-seconds').textContent=formatSeconds(seconds);
  $('result-minutes').textContent=new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(seconds/60);
  $('result-distance').textContent=new Intl.NumberFormat('vi-VN',{maximumFractionDigits:2}).format(input.straight_line_km_approx)+' km';
  $('result-pickup').textContent=String(input.pickup_hour).padStart(2,'0')+':'+String(input.pickup_minute_bucket).padStart(2,'0');
  $('result-empty').hidden=true;
  const panel=$('result-panel');panel.hidden=false;
  requestAnimationFrame(()=>panel.classList.add('visible'));
}

form.addEventListener('submit',event=>{
  event.preventDefault();
  if (!model){setNotice('Mô hình chưa sẵn sàng, vui lòng tải lại trang.');return;}
  try{
    const input=readForm();
    validateTrip(input);
    const seconds=predictTrip(input,model);
    setNotice('');
    renderResult(seconds,input);
    if (window.innerWidth<=920) $('results').scrollIntoView({behavior:'smooth',block:'start'});
  }catch(error){
    setNotice(error instanceof Error?error.message:String(error));
  }
});
$('preset-a').addEventListener('click',()=>loadPreset('A'));
$('preset-b').addEventListener('click',()=>loadPreset('B'));
$('reset-btn').addEventListener('click',()=>loadPreset('A'));
$('estimate-distance').addEventListener('click',()=>{
  try{
    const numberFields=['pickup_lon_approx','pickup_lat_approx','dropoff_lon_approx','dropoff_lat_approx'];
    const vals=numberFields.map(x=>Number($(x).value));
    if(vals.some(x=>!Number.isFinite(x))) throw new Error('Kiểm tra lại tọa độ đã nhập.');
    $('straight_line_km_approx').value=haversineKm(...vals).toFixed(2);
    setNotice('Đã ước tính khoảng cách Haversine từ tọa độ. Cột khoảng cách gốc của BTC có thể khác giá trị này.','info');
    $('preset-a').classList.remove('chosen');$('preset-b').classList.remove('chosen');
  }catch(e){setNotice(e.message)}
});
for(const key of INPUT_NAMES){
  $(key).addEventListener('change',()=>{$('preset-a').classList.remove('chosen');$('preset-b').classList.remove('chosen');});
}

loadPreset('A');
(async()=>{
 try{
   updateStatus('Đang tải mô hình LightGBM…');
   const url=new URL('./lightgbm_model.json',import.meta.url);
   const response=await fetch(url,{cache:'force-cache'});
   if (!response.ok) throw new Error('HTTP '+response.status);
   const loaded=await response.json();
   if (loaded.tree_count!==2394 || loaded.feature_names.length!==45 || loaded.trees.length!==2394){
     throw new Error('Tệp mô hình không đúng cấu trúc.');
   }
   model=loaded;predictButton.disabled=false;
   updateStatus('Mô hình sẵn sàng · 2.394 cây · 45 đặc trưng','ready');
 }catch(err){
   updateStatus('Không thể tải mô hình','error');
   setNotice('Không tải được mô hình LightGBM. Khi thử trên máy, hãy chạy qua HTTP (ví dụ: python -m http.server 8000), không mở index.html bằng file://. Chi tiết: '+err.message);
 }
})();
