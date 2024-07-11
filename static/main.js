import { getCookie, getAccessTokenWithRefreshToken } from './tokenUtils.js';

let API_SERVER_DOMAIN = "https://api.byuldajul.shop";

// 토큰 가져오기
document.addEventListener("DOMContentLoaded", function () {

    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");

    console.log(accessToken);
    console.log(refreshToken);
    
    if (accessToken) {
        // accessToken이 있는 경우, 서버에 사용자 정보 요청
        getUser(accessToken)
          .then((name) => {
            //코드 작성
          })
          .catch((error) => {
            console.error("User info error:", error);
            // accessToken이 만료된 경우 refresh 토큰을 사용하여 새로운 accessToken을 가져옴
            if (refreshToken) {
              getAccessTokenWithRefreshToken(refreshToken)
                .then((newAccessToken) => {
                  // 새로운 accessToken으로 사용자 정보 요청
                  getUser(newAccessToken)
                    .then((name) => {
                      //코드작성
                    })
                    .catch((error) => {
                      console.error(
                        "User info error after refreshing token:",
                        error
                      );
                    });
                })
                .catch((error) => {
                  console.error("Failed to refresh access token:", error);
                });
            }
        });
    }
  
});

//[API] User 정보 가져오기
function getUser(accessToken) {
    return fetch(API_SERVER_DOMAIN + "/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    })
      .then((response) => {
        //console.log(response)
        if (!response.ok) {
          throw new Error("Failed to refresh access token");
        }
        return response.json();
      })
      .then((data) => {
        // console.log(data)
        document.getElementById("username").textContent = data.nickname;
      });
  
  }




function changeImage(event, element) {
    event.preventDefault(); // 기본 링크 동작을 막음

    var icons = document.querySelectorAll('ul li img');
    for (var i = 0; i < icons.length; i++) {
        var img = icons[i];
        var originalSrc = img.getAttribute('src');
        var newSrc = originalSrc.replace('click_', ''); 
        img.setAttribute('src', newSrc);
    }
    
    // 클릭된 이미지의 src 속성을 업데이트
    var clickedImg = element.querySelector('img');
    var currentSrc = clickedImg.getAttribute('src');
    
    if (!currentSrc.includes('click_')) {
        var newSrc = currentSrc.replace('./img/Icon/', './img/Icon/click_');
        clickedImg.setAttribute('src', newSrc);
    }

    // 링크로 이동
    var link = element.getAttribute('href');
    if (link) {
        window.location.href = link;
    }
}

var preloadImages = function (srcs) {
    srcs.forEach(function (src) {
        var img = new Image();
        img.src = src;
    });
};

// 사용할 이미지 경로들을 배열로 지정
var imagePaths = [
    './img/Icon/home_icon.png',
    './img/Icon/click_diary_icon.png',
    './img/Icon/book_icon.png',
    './img/Icon/idea_icon.png'
];

// 페이지 로드 시 이미지 프리로딩
preloadImages(imagePaths);


// 캘린더
document.addEventListener('DOMContentLoaded', function() {
    const calendarBody = document.getElementById('calendarBody');
    const monthYear = document.getElementById('monthYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');
    let currentMonth = new Date().getMonth();
    let currentYear = new Date().getFullYear();
    const monthNames = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
        'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    

    function generateCalendar(month, year) {
        calendarBody.innerHTML = '';
        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = new Date(year, month, 0).getDate(); // Days in the previous month
        let date = 1;
        let nextMonthDate = 1;
        let prevMonthStart = prevMonthDays - firstDay + 1;

        monthYear.textContent = `${monthNames[month]} ${year}`;

        for (let i = 0; i < 6; i++) {
            const row = document.createElement('tr');
            for (let j = 0; j < 7; j++) {
                const cell = document.createElement('td');
                if (i === 0 && j < firstDay) {
                    cell.textContent = prevMonthStart++;
                    cell.classList.add('not-current-month');
                } else if (date > daysInMonth) {
                    cell.textContent = nextMonthDate++;
                    cell.classList.add('not-current-month');
                } else {
                    cell.textContent = date;
                    date++;
                }
                row.appendChild(cell);
            }
            calendarBody.appendChild(row);
        }
    }

    prevMonth.addEventListener('click', function() {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentMonth, currentYear);
    });

    nextMonth.addEventListener('click', function() {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentMonth, currentYear);
    });

    generateCalendar(currentMonth, currentYear);
});

// 템플릿 클릭시
document.addEventListener('DOMContentLoaded', () => {
    const templateTabs = document.querySelectorAll('.main_template_tab1, .main_template_tab2, .main_template_tab3');
    templateTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const templateType = tab.dataset.template;
            localStorage.setItem('selectedTemplate', templateType);
            window.location.href = './write_diary.html';
        });
    });
});
