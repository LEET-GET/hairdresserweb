var allBookings = [];
var allBookings0 = [];

fetchAllBookingsSub();
$(function() {
  
  $.datepicker.regional['ru'] = {
    closeText: 'Закрыть',
    prevText: '&#x3C;Пред',
    nextText: 'След&#x3E;',
    currentText: 'Сегодня',
    monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
      'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
    monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
      'Июл','Авг','Сен','Окт','Ноя','Дек'],
    dayNames: ['Воскресенье','Понедельник','Вторник','Среда','Четверг','Пятница','Суббота'],
    dayNamesShort: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
    weekHeader: 'Нед',
    dateFormat: 'dd.mm.yy',
    firstDay: 1,
    isRTL: false,
    showMonthAfterYear: false,
    yearSuffix: ''
    
  };

  $('#datepicker').datepicker($.extend({
    
    minDate: 0, // Disable past dates
    beforeShowDay: function(date) {
      if (date+1 <= new Date()) {
        return [false, "dimmed", "Прошедшие дни"]; // Disable and style past dates
      } else {
        return [true, "", ""];
      }
    },
    onSelect: function(dateText) {
      selectedDate = dateText; // Сохраняем выбранную дату
      console.log(selectedDate);
      updateAvailableTimeSlotsForDate(selectedDate);
      updateAvailableTimeSlotsForDate2(selectedDate);
      $('#timeSelectionScreen').show();
    }
  }, $.datepicker.regional['ru']));

  

  
  console.log($('.time-slot').length);

  
  function updateAvailableTimeSlotsForDate(date) {
    var bookingsForDate = allBookings0[date];
    $('.time-slot').each(function() {
      var time = $(this).text().replace(':', ''); // Convert "8:00" to "800"
      if (bookingsForDate && bookingsForDate[time] === 'no') {
        $(this).css('background-color', '');
      } else {
        $(this).css('background-color', 'red');
      }
    });
  }

  function updateAvailableTimeSlotsForDate2(date) {
    var bookingsForDate = allBookings0[date];
    $('.time-slot').each(function() {
      var timeSlotButton = $(this);
      var time = timeSlotButton.text().replace(':', '');
      if (bookingsForDate && bookingsForDate[time]) {
        // Create a tooltip title with the booking information
        timeSlotButton.attr('title', bookingsForDate[time]).tooltip();
      } else {
        timeSlotButton.removeAttr('title').tooltip("destroy");
      }
    });
  }
  
  // Call this function whenever you fetch new bookings or when a new date is selected
  
  
  

  

  // Dialog for category selection
  $('#categoryButton').click(function() {
    fetchAllBookings();
    $('#categoryDialog').dialog({
      resizable: false,
      modal: true,
      buttons: {
        'OK': function() {
          var selectedCategory = $('input[name=category]:checked').val();
          $('#categoryButton').text(selectedCategory);
          $(this).dialog('close');
          // Trigger the service selection dialog
          $('#serviceButton').trigger('click');
        }
      }
    });
  });

  // Array to hold selected services
  var selectedServices = [];
  var selectedDate;
  var selectedSpecialistName = null;


  // Dialog for service selection
  $('#serviceButton').click(function() {
    var selectedCategory = $('#categoryButton').text();
    var services = [];
    if (selectedCategory === 'Спецпредложение салона') {
      services = ['Полировка волос (уход+полировка+сушка) 2750р.  2 ч.', 'Пилинг волос и кожи   2700 р. 30 мин.', 'Лазерная депиляция (лазер 1SPRO) все тело 9500 р. 2 ч.'];
    } else if (selectedCategory === 'Химическая завивка constant delight') {
      services = ['Химическая завивка (длина волос от 10-15 см)  3500 р.    2,5 ч.', 'Химическая завивка (длина волос от 15-25 см)   4500 р.   3 ч.', 'Химическая завивка (длина волос от 25- 40 см)  от 5500 до 6500 р 3,5 ч.'];
    } else if (selectedCategory === 'Стрижка') {
      services = [
        'Женская стрижка модельная (длина волос до 10 см) 1290 р. 30 мин.',
        'Женская стрижка модельная (длина волос до 25 см) 1590 р. 40 мин.',
        'Женская стрижка модельная (длина волос до 40 см) 1850 р. 50 мин.',
        'Женская стрижка креативная (длина волос до 10 см) 1800 р. 40 мин.',
        'Женская стрижка креативная (длина волос до 25 см) 2350 р. 50 мин.',
        'Женская стрижка креативная (длина волос до 40 см) 2850 р. 60 мин.',
        'Стрижка равнение концов одним срезом (без мытья) 790 р. 20 мин.',
        'Мужская стрижка Классическая 950 р. 30 мин.',
        'Мужская стрижка Барбер 1150 р. 40 мин.',
        'Мужская стрижка (машинкой 2 насадки) 590 р. 20 мин.',
        'Мужская стрижка (машинкой наголо) 490 р. 10 мин.',
        'Детская стрижка (до 7 лет) 790 р. 30 мин.',
        'Детская стрижка Барбер (до 7 лет) 950 р. 40 мин.',
        'Детская стрижка Каре (до 7 лет) 1100 р. 40 мин.',
        'Рисунок на голове (простой) 150 р. 5 мин.',
        'Рисунок на голове(сложный) 250 р. 10 мин.',
        'Стрижка челки 400 р. 10 мин.',
        'Стрижка челки креативная 500 р. 15 мин.',
        'Стрижка бровей 100 р. 5 мин.',
        'Окантовка 300 р. 10 мин.',
        'Коррекция формы бороды/усов 500 р. 15 мин.',
        'Мытье головы+Сушка волос феном на брашинг (длина волос до 10 см) 400 р. 20 мин.',
        'Мытье головы+Сушка волос феном на брашинг (длина волос до 25 см) 550 р. 30 мин.',
        'Мытье головы+Сушка волос феном на брашинг (длина волос до 40 см) 650 р. 35 мин.'
      ];
    } else if (selectedCategory === 'Создание Образа') {
      services = [
        'Укладка (длина волос до 10 см) 790 р. 30 мин.',
        'Укладка (длина волос до 25 см) 990 р. 40 мин.',
        'Укладка (длина волос до 40 см) 1290 р. 60 мин.',
        'Укладка нарощенных волос (длина волос до 40 см) 1690 р. 60 мин',
        'Укладка в составе другой услуги (длина волос до 10 см) 490 р. 30 мин.',
        'Укладка в составе другой услуги (длина волос до 25 см) 690 р. 30 мин.',
        'Укладка в составе другой услуги (длина волос до 40 см) 990 р. 30 мин.',
        'Коктейльная прическа (горячими инструментами длина до 20 см) 1690 р. 60 мин',
        'Коктейльная прическа (горячими инструментами длина до 30 см) 1890 р. 60 мин',
        'Коктейльная прическа (горячими инструментами длина до 50 см) 2190 р. 60 мин',
        'Коктейльная прическа нарощенных волос 2590 р. 60 мин',
        'Свадебная прическа от 3500 р. от 60 мин-120 мин',
        'Плетение кос (одна коса) от 550 р – 1100 р. 30 мин.',
        'Дневной макияж 2200 р. 30 мин',
        'Вечерний макияж 3200 р. 45 мин'
      ];
    } else if (selectedCategory === 'Колористическое меню Matrix') {
      services = [
        'Окрашивание корней (до 2 см) 30 гр. 2100 р. 2 часа',
        'Окрашивание (в один тон/45 гр.) 2490 р. 2 часа',
        'Окрашивание (в один тон/60 гр.) 2990 р. 2 часа',
        'Окрашивание (в один тон/90 гр.) 3600 р. 2 часа',
        'Тонирование (в один тон/45гр.) 2550р. 2 часа',
        'Тонирование (в один тон/60гр.) 2650р. 2 часа',
        'Тонирование (в один тон/90гр.) 3750р. 2 часа',
        'Камуфляж головы (мужской) 1800 р. 1.5 часа',
        'Камуфляж бороды/усов (мужской) 1000 р. 30 мин',
        'Дополнительная порция красителя/осветляющего порошка 15 гр. 650 р.'
      ];
    } else if (selectedCategory === 'Блонд Matrix') {
      services = [
        'Мини мелирование до 10 прядей 2100 р. 2часа',
        'Мелирование Т-зоны 3550 р. 2,5 часа',
        'Мелирование половины головы 3750 р. 2,5 часа',
        'Мелирование всей головы 5990 р. 3 часа',
        'Блондирование корней (до 2 см) 2400 р. 1,5 часа',
        'Блондирование длины (до 25 см) 3900 р. 2 часа',
        'Блондирование длины (до 40 см) 5200 р. 3 часа',
        'Блондирование длины на фальгу (до 40 см) от 6500 р. 3,5 часа',
        'Блондирование/ 30 гр. пудры 1300 р.',
        'Блондирование /90 гр. краситель 3900 р.',
        'Сложное окрашивание Matrix AIRTOUCH (длина до 25 см) от 9500 р. 4 часа',
        'Сложное окрашивание Matrix AIRTOUCH (длина до 50 см) от 11500 р. 4-5 часов',
        'Сложное окрашивание Matrix AIRTOUCH (длина от 50 см) от 13600 р. 5-6 часов'
      ];
    } else if (selectedCategory === 'Брови и Ресницы') {
      services = [
        'Архитектура бровей (создание формы) 800 р. 30 мин',
        'Коррекция бровей 550 р. 30 мин',
        'Окрашивание бровей краской 600 р. 20 мин',
        'Окрашивание ресниц краской 600 р. 15 мин',
        'Окрашивание бровей хной 990 р. 30 мин',
        'Окрашивание бровей/ресниц/коррекция бровей 1750 р. 60 мин. (услуга «Три в одном»)',
        'Окрашивание бровей краской/ коррекция бровей 1150 р. 40 мин.',
        'Ламинирование бровей 2500 р. 2 ч.',
        'Ламинирование ресниц 2500 р. 2,5 ч.',
        'Снятие нарощенных ресниц 690 р. 30 мин.',
        'Пудровое напыление бровей 8000 р. 2 ч',
        'Коррекция пудровых бровей 6000 р. 1,5 ч.',
        'Межресничный край веко 6000 р. 1,5 ч.',
        'Стрелка фигурная на веко 8000 р. 2 ч.',
        'Стрелка с расстушевкой на веко 8000 р. 2 ч.',
        'Пудровое напыление губ 8000 р. 2 ч.'
      ];
    } else if (selectedCategory === 'Прокол ушей') {
      services = [
        'Прокол ушей (серьги в комплекте) 1790 р. 15 мин',
        'Прокол ушей (серьги с цирконием в комплекте) 1890 р. 15 мин'
      ];
    } else if (selectedCategory === 'Уходы MATRIX') {
      services = [
        'Нейтрализация желтизны Brass off (длина волос до 10 см) 450 р. 15 мин',
        'Нейтрализация желтизны Brass off (длина волос до 25 см) 590 р. 15 мин',
        'Нейтрализация желтизны Brass off (длина волос до 50 см) 690 р. 20 мин',
        'Маска глубокого восстановления Total Treat (длина волос до 10 см) 700 р. 20 мин',
        'Маска глубокого восстановления Total Treat (длина волос до 25 см) 800 р. 20 мин',
        'Маска глубокого восстановления Total Treat (длина волос до 50 см) 900 р. 20 мин',
        'Глубокий уход и восстановление Biolage (длина волос до 10 см) 890 р. 20 мин',
        'Глубокий уход и восстановление Biolage (длина волос до 25 см) 1190 р. 20 мин',
        'Глубокий уход и восстановление Biolage (длина волос до 50 см) 1490 р. 20 мин',
        'Уход Бондинг (длина волос до 25 см) 1200 р. 30 мин',
        'Уход Бондинг (длина волос от 25 см) 1500 р. 30 мин',
        'Уход Бондинг (длина волос от 50 см) 1800 р. 40 мин',
        'Бондинг в окрашивании (длина волос до 25 см) 800 р. 30 мин',
        'Бондинг в окрашивании (длина волос от 25 см) 1200 р. 30 мин',
        'Бондинг в окрашивании (длина волос от 50 см) 1700 р. 40 мин',
        'Бондинг в осветлении (длина волос до 25 см) 1200 р. 30 мин',
        'Бондинг в осветлении (длина волос от 25 см) 1700 р. 30 мин',
        'Бондинг в осветлении (длина волос от 50 см) 2200 р. 40 мин'
      ];
    } else if (selectedCategory === 'Уходы MATRIX') {
      services = [
        'Глубокое питание рук (горячий парафин)                   500 р.     20 мин',
        'Глубокое увлажнение рук (холодный парафин)       500 р.      20 мин',
        'Пилинг для рук и ногтей   (с маслом персика)           300 р.      20 мин',
        'Пилинг стоп и ногтей (с морской солью)                     350 р.      10 мин',
        'Глубокое питание стоп (горячий парафин)                 500 р       20 мин',
        'Глубокое увлажнение стоп (холодный парафин       500 р.      20 мин',
        'Расслабляющая процедура рук (массаж 5 мин)        300 р.',
        'Расслабляющая процедура стоп (массаж 5 мин)       350 р.',
      ];
    } else if (selectedCategory === 'Уходы Ybera') {
      services = [
        'Кератиновое выпрямление и питание фиолетовым составом FASHION STYLIST PLATIUM (длина волос до 25 см) 3500 р. 3 часа',
        'Кератиновое выпрямление и питание фиолетовым составом FASHION STYLIST PLATIUM (длина волос от 25 см) 6500 р. 4 ч',
        'Кератиновое выпрямление и питание фиолетовым составом FASHION STYLIST PLATIUM (длина волос от 50 см) 8500 р. 4 ч',
        'SPA процедура Интенсивное увлажнение «Горячий ботокс» (длина волос до 25 см) 2200/3700/4700',
        'SPA процедура «Холодный ботокс» (длина волос до 25 см) 2400/3900/4900 2 ч.'
      ];
    } else if (selectedCategory === 'Уходы HONMA') {
      services = [
        'Кератиновое выпрямление COFFEE PREMIUM (длина волос от 10-50 см) 3990/5790/7990 4 ч.',
        'Нанопластика COFFEE GREEN (длина волос от 10- 50 см) 2990/4190/5490 2 ч',
        'Нанопластика BIO COCONUT COLLAGEN (длина волос до 25 см) 3090/4290/5690 3 ч',
        'Биксипластия PLAST HAIR (длина волос от 10- 50 см) 4090/5790/8000 3 ч',
        'Ботокс для волос H BRUSH (длина волос от 10- 50 см) 1690/2690/3500 2 ч',
        'Уход Счастье для волос (длина волос от 10- 50 см) 3900/4900/5900',
        'Обертывание волос шелком (длина волос от10-50 см) 3900/4900/5900'
      ];
    } else if (selectedCategory === 'Педикюр') {
      services = [
        'Классический педикюр 1650 р. 60 мин.',
        'Аппаратный/комбинированный педикюр 1750 р. 60 мин.',
        'SMART-педикюр 2150 р. 60 мин.',
        'Бразильский педикюр 1890 р. 60 мин.',
        'Мужской педикюр 2200 р. 45 мин.',
        'Экспресс педикюр (обработка пальчиков) 1200 р. 30 мин',
        'Обработка мозоля, натоптыша 250 р/1шт. 10 мин',
        'Обработка стержневого мозоля 300 р/1шт. 10 мин',
        'Обработка вросшего ногтя 300 р/1 шт. 10 мин',
        'Педикюр/маникюр (в четыре руки) 2600 р. 1 ч',
        'Педикюр/маникюр/покрытие гель-лак 2 раза (в четыре руки) 4900 р. 2 ч 30 мин',
        'Педикюр/маникюр/покрытие гель-лак 2 раза Luxsio (в четыре руки) 5000 р. 2 ч 30 мин'
      ];
    } else if (selectedCategory === 'Уходы за лицом KLAPP') {
      services = [
        '"Бодрость на весь день" (альгинатный уход) 1090 р. 30 мин',
        '"Легкая перезагрузка" (экспресс уход, включает 15 минут массажа) 1590 р. 45 мин',
        '"Здоровое сияние" (уход за проблемной жирной кожей) 2390 р. 60 мин',
        '"Тропический дождь" (уход увлажнение) 2390 р. 60 мин',
        '"Вечная весна" (уход для возрастной кожи) 2390 р. 60 мин',
        '"Нежное касание" (уход для чувствительной кожи) 2390 р. 60 мин',
        '"До и после солнца" (уход восстановления кожи) 2690 р. 60 мин',
        '"Голливуд" уход VIP на выход 3600 р. 60 мин',
        'Карбокситерапия для жирной кожи 1490 р. 60 мин',
        'Карбокситерапия для возрастной кожи 1490 р. 60 мин',
        'Карбокситерапия для сухой кожи 1490 р. 60 мин',
        'Уход кожи вокруг глаз и височной зоны (микротоки) 1590 р. 30 мин',
        'Уход кожи лицо/вокруг глаз (микротоки) 2390 р. 45 мин',
        'Уход кожи лицо/шея/декольте/глаза (микротоки) 2990 р. 60 мин',
        'Безинъекционная мезотерапия 3600 р. 60 мин',
        'Пилинг всесезонный ARAVIA 1890 р. 30 мин',
        'Пилинг сезонный ARAVIA 1890 р. 30 мин',
        'Пилинг "Джесснера" 2600 р. 30 мин',
        'Пилинг "Гликолевый" 2400 р. 30 мин',
        'Пилинг "Салициловый" 2400 р. 30 мин',
        'Пилинг "Миндальный" 2400 р. 30 мин',
        'Пилинг "Молочный" 2400 р. 30 мин',
        'Пилинг "ТСА" 2400 р. 30 мин',
        'Пилинг "Питоновый" желтый 3800 р. 40 мин',
        'Пилинг химический PRXT-33 3800 р. 40 мин',
        'Пилинг всесезонный BSP 3800 р. 40 мин',
        'Пилинг Гоммаж/ Энзимный 700 р. 15 мин',
        'Пилинг Гоммаж/ Энзимный (в составе другой услуги) 590 р. 15 мин',
        'Микролифтинг (Коррекция овала лица, насыщение кожи лица витаминами, запуск выработки коллагена и эластина) 2590 р. 45 мин',
        'Микролифтинг Вокруг глаз и височная зона 1590 р. 30 мин',
        'Микролифтинг Лицо/шея/декольте 3590 р. 60 мин',
        'Фарфоровая куколка (омоложение кожи лица/шей) 2990 р. 45 мин',
        'Криомассаж (ANTI-AGE уход, отечность, упругость, эластичность, сужение пор) 1490 р. 30 мин',
        'Массаж ультразвуковой+сыворотка по типу кожи 1990 р.',
        'Массаж классический 1590 р. 30 мин',
        'Массаж моделирующий, лимфодренаж 1990 р. 40 мин',
        'Массаж авторский "Крылья Ангела" 2400 р. 60 мин',
        'Чистка лица механическая 2690 р. 90 мин',
        'Чистка лица ультразвуковая 2200 р. 60 мин',
        'Чистка комбинированная 3000 р. 2 ч',
        'Чистка вакуумная 1990 р. 60 мин',
        'Чистка спины 3500 р. 2 ч.',
        'Лечение акне PhFormula 1290 р. (1 ампула) 15 мин',
        'Интенсивный уход для лица ANTI-AGE 1290 р. (1 ампула) 15 мин',
        'Маска альгинатная ARAVIA 790 р. 30 мин',
        'Маска глубокое увлажнение KLAPP 990 р. 30 мин',
        'Маска анти-стресс KLAPP 990 р. 30 мин',
        'Маска восстанавливающая KLAPP 990 р. 30 мин',
        'Сыворотка по типу кожи KLAPP 990 р. 30 мин',
        'Сыворотка по типу кожи KLAPP (в составе другой услуги) 790 р. 15 мин',
        'Дарсонвализация лица/шей 990 р. 30 мин'
      ];
    } else if (selectedCategory === 'Депиляция') {
      services = [
        'Воск: Глубокое бикини 1750 р. 60 мин',
        'Воск: Бикини классика 1300 р. 40 мин',
        'Воск: Руки полностью 1150 р. 30 мин',
        'Воск: Руки до локтя 700 р. 20 мин',
        'Воск: Руки выше локтя 700 р. 20 мин',
        'Воск: Ноги полностью 1490 р. 40 мин',
        'Воск: Ноги до колен 750 р. 20 мин',
        'Воск: Ноги выше колен 750 р. 20 мин',
        'Воск: Живот 1150 р. 20 мин',
        'Воск: Спина 1850 р. 30 мин',
        'Воск: Ягодицы 850 р. 20 мин',
        'Воск: Подмышечные впадины 650 р. 30 мин',
        'Воск: Пальчики на ногах 300 р. 15 мин',
        'Воск: Лицо (верхняя губа 1 зона) 400 р. 10 мин',
        'Шугаринг: Глубокое бикини 1750 р. 60 мин',
        'Шугаринг: Бикини классика 1300 р. 40 мин',
        'Шугаринг: Руки полностью 1250 р. 30 мин',
        'Шугаринг: Руки до локтя 780 р. 20 мин',
        'Шугаринг: Руки выше локтя 780 р. 20 мин',
        'Шугаринг: Ноги полностью 1590 р. 40 мин',
        'Шугаринг: Ноги до колен 780 р. 20 мин',
        'Шугаринг: Ноги выше колен 780 р. 20 мин',
        'Шугаринг: Живот 1250 р. 20 мин',
        'Шугаринг: Спина 1950 р. 30 мин',
        'Шугаринг: Ягодицы 900 р. 20 мин',
        'Шугаринг: Подмышечные впадины 700 р. 30 мин',
        'Шугаринг: Пальчики на ногах 350 р. 15 мин',
        'Шугаринг: Лицо (верхняя губа 1 зона) 450 р. 10 мин',
        'Лазерная депиляция (1S PRO Диодный лазер): Деликатная зона лицо/верхняя губа 650 р.',
        'Лазерная депиляция: Подмышечные впадины 900 р.',
        'Лазерная депиляция: Глубокое бикини 2350 р.',
        'Лазерная депиляция: Бикини классика 1650 р.',
        'Лазерная депиляция: Руки полностью 2450 р.',
        'Лазерная депиляция: Руки до локтя 1150 р.',
        'Лазерная депиляция: Руки выше локтя 1150 р.',
        'Лазерная депиляция: Ноги полностью 2950 р.',
        'Лазерная депиляция: Ноги до колен 1450 р.',
        'Лазерная депиляция: Ноги выше колен 1450 р.',
        'Лазерная депиляция: Живот 1450 р.',
        'Лазерная депиляция: Спина 2950 р.',
        'Лазерная депиляция: Ягодицы 1350 р.',
        'Лазерная депиляция: Пальчики на ногах 500 р.',
        'Лазерная депиляция: Тело полностью 9500 р.'
      ];
    } else if (selectedCategory === 'Маникюр') {
      services = [
        'Классический/европейский 800 р. 40 мин',
        'Аппаратный/комбинированный 900 р. 40 мин',
        'Бразильский маникюр 990 р. 40 мин',
        'Японский маникюр 990 р. 40 мин',
        'Мужской маникюр 950 р. 40 мин',
        'Детский маникюр (до 7 лет) 600 р. 30 мин',
        'Придание формы ногтям 300 р. 10 мин'
      ];
    } else if (selectedCategory === 'Покрытия') {
      services = [
        'Покрытие ногтей стойким лаком 500 р. 20 мин',
        'Покрытие ногтей стойким лаком френч 550 р. 30 мин',
        'Покрытие гель-лак E.mi Lac/Луи Филипп 1200 р. 30 мин',
        'Покрытие гель-лак френч E.mi Lac/Луи Филипп 1390 р. 40 мин',
        'Покрытие гель-лак Luxsio 1250 р. 30 мин',
        'Покрытие гель-лак френч Luxsio 1490 р. 40 мин',
        'Покрытие гель-лак «Кошачий глаз» E.mi Lac/Луи Филипп 1390 р. 40 мин',
        'Снятие лака 100 р. 15 мин',
        'Снятие гель-лака/в составе другой услуги/ 350 р. 30 мин',
        'Снятие гель-лака 450 р. 30 мин',
        'Снятие искусственных ногтей (гель) 650 р. 40 мин'
      ];
    } else if (selectedCategory === 'Укрепление ногтей') {
      services = [
        'Лечебное покрытие 250 р. 10 мин',
        'Укрепление ногтевой пластины IBX 850 р. 20 мин',
        'Укрепление ногтей базой 450 р. 20 мин',
        'Укрепление ногтей акриловой пудрой 450 р. 20 мин',
        'Укрепление ногтей гелем 750 р. 40 мин',
        'Полировка ногтей маслом/воском 300 р. 15 мин',
        'Японская полировка ногтей 390 р. 20 мин',
        'Глубокое питание рук (горячий парафин) 500 р. 20 мин',
        'Глубокое увлажнение рук (холодный парафин) 500 р. 20 мин',
        'Пилинг для рук и ногтей (с маслом персика) 300 р. 20 мин',
        'Пилинг стоп и ногтей (с морской солью) 350 р. 10 мин',
        'Глубокое питание стоп (горячий парафин) 500 р. 20 мин',
        'Глубокое увлажнение стоп (холодный парафин) 500 р. 20 мин',
        'Расслабляющая процедура рук (массаж 5 мин) 300 р.',
        'Расслабляющая процедура стоп (массаж 5 мин) 350 р.'
      ];
    } else if (selectedCategory === 'Художественное оформление ногтей') {
      services = [
        'Художественный дизайн-роспись 1 ноготь от 250 р. 20 мин',
        'Художественный дизайн-роспись (геометрия) 1 ноготь от 390 р. 20 мин',
        'Художественный дизайн (слайдеры, наклейки) от 100 р. 10 мин',
        'Омбре-дизайн 1 ноготь от 100 р. 5 мин',
        'Художественный дизайн (Втирка, Кошачий глаз) 1 ноготь от 100 р. 5 мин',
        'Страза 1 шт. 50 р.'
      ];
    } else if (selectedCategory === 'Моделирование и коррекция ногтей') {
      services = [
        'Моделирование гелем +покрытие гель-лак (короткие) 3500 р. 2 ч',
        'Моделирование гелем +покрытие гель-лак (средние) 4000 р. 2,5 ч',
        'Моделирование гелем +покрытие гель-лак (длинные) 4500 р. 3 ч',
        'Моделирование френч гелем (короткие) 3990 р. 2,5 ч',
        'Моделирование френч гелем (средние) 4590 р. 3 ч',
        'Моделирование френч гелем (длинные) 4990 р. 3,5 ч',
        'Коррекция гелем (без покрытия гель+лак) 2400 р. 2 ч.',
        'Коррекция гелем +покрытие гель-лак 3400 р. 2 ч.',
        'Коррекция гелем под френч 3700 р. 2,5 ч',
        'Ремонт 1 ноготь гель-лак 150 р. 20 мин',
        'Ремонт 1 ноготь гель + гель лак 350 р. 30 мин',
        'Ремонт 1 ноготь гель френч 400 р. 30 мин.'
      ];
    }    
    
    // Build and show the service selection dialog
    var serviceSelectionHtml = '<p>Выберите услугу:</p>';
    $.each(services, function(index, service) {
      serviceSelectionHtml += '      <label class="service-item"> <input type="radio" name="service" value="' +
                              service + '">' + service + '</label>';
    });
    $('#serviceDialog').html(serviceSelectionHtml).dialog({
      resizable: false,
      modal: true,
      buttons: {
        'OK': function() {
          var selectedService = $('input[name=service]:checked').val();
          selectedServices.push(selectedService);
          updateSelectedServicesUI();
          $(this).dialog('close');
        }
      }
    });
  });

  function updateSelectedServicesUI() {
    var servicesListHtml = selectedServices.map(function(service, index) {
      return '<li>' + service + 
             '<button class="deleteService" data-index="' + index + '">X</button></li>';
    }).join('');
    $('#selectedServicesList').html(servicesListHtml);
    $('#addMoreServices').show();
  }
  
  $('#selectedServicesList').on('click', '.deleteService', function() {
    var indexToRemove = parseInt($(this).data('index'), 10);
    selectedServices.splice(indexToRemove, 1);
    updateSelectedServicesUI(); // Update the list
  });

  // Allow adding more services
  $('#addMoreServices').click(function() {
    $('#serviceButton').click();
  });

  var specialists = [
    {
      name: "Наталия",
      description: "Парикмахер",
      photo: "Screenshot_16.jpg" // Измените на реальный путь к изображению
    },
    {
      name: "Екатерина",
      description: "Мастер ногтевого сервиса",
      photo: "настя-682x1024.jpg" // Измените на реальный путь к изображению
    }
    // ... другие специалисты ...
  ];

  $('#specialistButton').click(function() {
    var specialistHtml = specialists.map(function(specialist, index) {
      return `
        <li class="specialistItem" data-index="${index}">
          <img class="specialistPhoto" src="${specialist.photo}" alt="${specialist.name}">
          <h3>${specialist.name}</h3>
          <p class="specialistDescription">${specialist.description}</p>
          <button type="button" class="selectSpecialistButton">Выбрать</button>
        </li>
      `;
    }).join('');

    $('#specialistList').html(specialistHtml);
    $('#specialistDialog').dialog({
      resizable: false,
      modal: true,
      width: 'auto',
      title: "Выберите специалиста"
    });
  });
  $('#closeTimeSelection').click(function() {
    $('#timeSelectionScreen').hide();
  });

  // Обработчик клика на кнопку выбора специалиста
  $(document).on('click', '.selectSpecialistButton', function() {
    var index = $(this).closest('.specialistItem').data('index');
    selectedSpecialistName = specialists[index].name; // Сохраняем имя выбранного специалиста
    $('#specialistButton').text(selectedSpecialistName); // Обновляем текст кнопки
    $('#specialistDialog').dialog('close'); // Закрываем диалоговое окно
  });
  


  function incrementTime(time, increment) {
    let hours = Math.floor(time / 100);
    let minutes = time % 100;
  
    minutes += increment;
    if (minutes >= 60) {
      hours += 1;
      minutes -= 60;
    }
  
    return hours * 100 + minutes;
  }
  function formatTime(time) {
    let hours = Math.floor(time / 100);
    let minutes = time % 100;
  
    return hours * 100 + minutes; // Убирает ведущий ноль у часов меньше 10
  }
  $('#bookButton').click(function() {
    var dateTimeRange = $('#datepicker').val(); // "14.01.2024 9:00-10:00"
    var [date, timeRange] = dateTimeRange.split(' ');
    var [startTime, endTime] = timeRange.split('-').map(time => time.replace(':', ''));
  
    var startTimeInt = parseInt(startTime, 10);
    var endTimeInt = parseInt(endTime, 10);
  
    // Get the name and phone number from input fields (Assuming you have input fields with these IDs)
    var name = $('#Name').val();
    var phoneNumber = $('#phoneNumber').val();
    var spec = $('#specialistButton').val();

    var timeSlots = {};
    for (let time = startTimeInt; time < endTimeInt; time = incrementTime(time, 30)) {
      let formattedTime = formatTime(time);
      // Append the name and phone number to each time slot
      timeSlots[formattedTime] = $('#selectedServicesList').text() + ', Имя: ' + name + ', Телефон: ' + phoneNumber + ', Специалист: ' + spec;
    }
  
    var bookingData = {
      date: date,
      timeSlots: timeSlots
    };

    // Inside your click event
    $.ajax({
      url: 'https://scheduleforhairdresser.onrender.com/submit-booking',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(bookingData),
      success: function(response) {
        alert('Вы успешно записаны! Ожидайте звонка.');
      },
      error: function(xhr, status, error) {
        alert('Запись не удалась: ' + error);
      }
    });
});



  $('.time-slot').click(function() {
    var selectedTime1 = $(this).text();
    $('#timeSelectionScreen').hide(); // скрываем экран выбора времени
    console.log("hide1");
    $('#timeSelectionScreen').show(); // показываем опять экран выбора времени
    $('.time-slot').click(function() {
        var selectedTime2 = $(this).text();
        var dateTime = selectedDate + ' ' + selectedTime1 + '-' + selectedTime2; // формируем строку с датой и временем
        $('#datepicker').val(dateTime); // Обновляем поле ввода
        $('#timeSelectionScreen').hide();
        console.log("hide2");
    });
  });
});

function fetchAllBookings() {
  $.ajax({
    url: 'https://scheduleforhairdresser.onrender.com/get-all-bookings',
    type: 'GET',
    success: function(data) {
      allBookings0 = convertBookingsToMap(data);
      console.log(allBookings0); // debugging
    },
    error: function(xhr, status, error) {
      console.error('Error fetching all bookings:', error);
    }
  });
}

function fetchAllBookingsSub() {
    $.ajax({
      url: 'https://scheduleforhairdresser.onrender.com/get-all-submited-bookings',
      type: 'GET',
      success: function(data) {
      console.log('Data from server:', data); // Inspect the data
      displayBookings(data);
      allBookings = convertBookingsToMap(data);
      },
      error: function(xhr, status, error) {
      console.error('Error fetching all bookings:', error);
      }
      });
      }


      function displayBookings(bookings) {
        const bookingsContainer = $('#bookingsContainer');
        bookingsContainer.empty(); 
      
        bookings.forEach((booking, index) => {
          const dateTime = booking.date.split(' ');
          const formattedDate = dateTime[0];
          const formattedTime = dateTime[1];
      
          bookingsContainer.append(`
            <div class="booking">
              <h3>Запись ${index + 1}</h3>
              <p>Услуги: ${booking.service}</p>
              <p>Специалист: ${booking.Specialist}</p>
              <p>Имя: ${booking.name}</p>
              <p>Телефон: ${booking.phone}</p>
              <p>Дата: ${formattedDate}</p>
              <p>Время: ${formattedTime}</p>
              <button onclick="addBooking('${booking._id}')">Добавить запись</button>
              <button onclick="deleteBooking('${booking._id}')">Удалить запись</button>
              </div>
          `);
        });
      }


      function countDots(services) {
        var services = booking.service;
        return (booking.service.match(/\./g) || []).length;
    }
    
    function incrementTime(time, increment) {
        let hours = Math.floor(time / 100);
        let minutes = time % 100;
        minutes += increment;
        if (minutes >= 60) {
            hours += 1;
            minutes -= 60;
        }
        return (hours * 100) + minutes;
    }
    
    function addBooking(bookingId) {
        // Fetch the booking data based on the bookingId
        console.log(Array.isArray(allBookings)); // Should log true
        let booking = allBookings.find(b => b._id === bookingId);
        let services = booking.service;
        let numberOfDots = countDots(services);
        let duration = numberOfDots * 30; // Each dot represents 30 minutes
    
        let startTimeString = booking.time.replace(':', ''); // Example: "8:00" becomes "800"
        let startTimeInt = parseInt(startTimeString, 10);
        let endTimeInt = startTimeInt;
    
        for (let i = 0; i < duration; i += 30) {
            endTimeInt = incrementTime(endTimeInt, 30);
        }
    
        let timeSlots = {};
        for (let time = startTimeInt; time < endTimeInt; time = incrementTime(time, 30)) {
            let formattedTime = formatTime(time);
            timeSlots[formattedTime] = booking.service + ', Имя: ' + booking.name + ', Телефон: ' + booking.phone + ', Специалист: ' + booking.Specialist;
        }
    
        var bookingData = {
            date: booking.date,
            timeSlots: timeSlots
        };
    
        // AJAX call to submit the booking data
        $.ajax({
            url: 'https://scheduleforhairdresser.onrender.com/submit-booking',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(bookingData),
            success: function(response) {
                alert('Запись добавлена успешно.');
                // Additional UI update logic here
            },
            error: function(xhr, status, error) {
                alert('Ошибка при добавлении записи: ' + error);
            }
        });
    }
    
    function formatTime(time) {
        let hours = Math.floor(time / 100);
        let minutes = time % 100;
        return hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');
    }
    

function deleteBooking(bookingId) {
  $.ajax({
    url: `https://scheduleforhairdresser.onrender.com/delete-booking/${bookingId}`,
    type: 'DELETE',
    success: function(response) {
      alert(response.message);
      fetchAllBookingsSub()    },
    error: function(xhr, status, error) {
      console.error('Error deleting booking:', error);
      alert('Error deleting booking: ' + error);
    }
  });
}
      
      
      

function convertBookingsToMap(bookingsArray) {
  var bookingsMap = {};
  bookingsArray.forEach(booking => {
    bookingsMap[booking.date] = booking;
  });
  return bookingsMap;
}


