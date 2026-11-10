                                      jQuery(function ($) {
                                          $('.satisfactionBtn').on('click', function (e) {
                                              e.preventDefault();
                                              e.stopPropagation();
                                              var menuId = $('#satisfactionForm [name=menuId]').val();
                                              if (!menuId || (menuId != GLOBAL.menuId)) {
                                                  alert('페이지정보가 없어 평가를 처리할 수 없습니다.');
                                                  return;
                                              }
                                              if ($('#satisfactionForm [name=satisScore]:checked').length < 1) {
                                                  alert('평가점수를 선택해 주세요.');
                                                  return;
                                              }
                                              var params = $('#satisfactionForm').serialize();
                                              $.ajax({
                                                  url: $('#satisfactionForm').attr('action')
                                                  , type: 'post'
                                                  , data: params
                                                  , context: this
                                              }).done(function (data) {
                                                  if (data.success) {
                                                      alert('평가해주셔서 감사합니다.');
                                                      location.reload();
                                                  } else {
                                                      alert(data.text);
                                                  }
                                              }).fail(function () {
                                                  alert('서버오류로 평가를 처리하지 못하였습니다.[failure]');
                                              });
                                          });
                                      });