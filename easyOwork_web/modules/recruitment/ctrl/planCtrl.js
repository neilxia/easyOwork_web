//列表招聘计划
function planlistCtrl(){
    return['$rootScope','$scope','$filter','$modal','RecruitFlowService','MsgService','LocalStorage','Common',function($rootScope,$scope,$filter,$modal,RecruitFlowService,MsgService,LocalStorage,Common){
        var userinfo=LocalStorage.getObject('userinfo');
        $scope.initFun = function(){
            inquiryRecruitPlanFun();
        };
        $scope.thispages={
            total:null,
            pageNum:1,
            pageSize:10
        };
        //查询list
        function inquiryRecruitPlanFun(){
            $scope.options={
                //"channelName":"",	//查询某个渠道列表
                //"companyName":""	//查询某个渠道, 都不传入则查询所有渠道
            };
            var promise = RecruitFlowService.inquiryRecruitPlan({body:$scope.options});
            promise.success(function(data, status, headers, config){
                var sts=data.body.status;
                if(sts.statusCode==0){
                    var datalist=[];
                    if($rootScope.$stateParams.type=="1"){
                        angular.forEach(data.body.data.plans,function(val,ind){
                            if(val.planStatus=='未完成'){
                                datalist.push(val);
                            }
                        })
                    }else if($rootScope.$stateParams.type=="2"){
                        angular.forEach(data.body.data.plans,function(val,ind){
                            if(val.planStatus=='已完成'){
                                debugger;
                                datalist.push(val);
                            }
                        })
                    }else{
                        datalist=data.body.data.plans;
                    }
                    $scope.datalist=datalist;
                    $scope.thispages.total=$scope.datalist.length;	//分页
                }else{
                    MsgService.tomsg(data.body.status.errorDesc);
                }
            });
            promise.error(function(data, status, headers, config){
                MsgService.tomsg(data.body.status.errorDesc);
            });
        }
        /*===计划==*/
        //添加/修改/删除
        function changeRecruitPlanFun(change,row,$modalInstance,oldrow){
            if(oldrow==undefined){oldrow=row}
            var planEndDate=$filter('date')(row.planEndDate,'yyyy-MM-dd');
            if(change!='DELETE'){
                $scope.options={
                    "actionType":change,		//ADD, MODIFY, DELETE
                    "planName":oldrow.planName || "",		//招聘计划名称
                    "newPlanName":row.planName || "",		//新招聘计划名称
                    "planEndDate":planEndDate || "",		//计划完成时间
                    "planStatus":row.planStatus || "",		//已启动, 已取消, 已完成
                    "sponsor":row.sponsor[0] || row.sponsor || ''/*,
                    "recruitPositionDTOList":{
                        "positionName":row.xxx || "",	//职位名称
                        "positionRequirement":row.xxx || "",	//职位yaoqiu
                        "positionDesc":row.xxx || "",	//职位描述
                        "positionCount":row.xxx || "" 	//职位招聘人数
                    }*/
                }
            }else {
                $scope.options={
                    "actionType":change,		//ADD, MODIFY, DELETE
                    "planName":row.planName		//招聘计划名称
                };
            }
            debugger;
            var promise = RecruitFlowService.changeRecruitPlan({body:$scope.options});
            promise.success(function(data, status, headers, config){
                var sts=data.body.status;
                if(sts.statusCode==0){
                    inquiryRecruitPlanFun();
                    $modalInstance.close();
                }else{
                    MsgService.tomsg(data.body.status.errorDesc);
                }
            });
            promise.error(function(data, status, headers, config){
                MsgService.tomsg(data.body.status.errorDesc);
            });
        }
        //新增
        $scope.addmodelFun = function () {
            var modalInstance = $modal.open({
                templateUrl: 'addmodel.html',
                //size:'sm',
                controller: modalCtrl
            });
            function modalCtrl ($scope, $modalInstance) {
                $scope.thename='新增';
                $scope.modalform={};
                $scope.modalform.sponsor=[userinfo];
                $scope.modalform.sponsorarr=[[],[userinfo]];
                //提交增加
                $scope.ok = function (state) {
                    if(!state){return;} //状态判断
                    changeRecruitPlanFun('ADD',$scope.modalform,$modalInstance);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        };
        //编辑
        $scope.editFun = function (row) {
            var oldrow=angular.copy(row);
            var modalInstance = $modal.open({
                templateUrl: 'addmodel.html',
                controller: modalCtrl
            });
            function modalCtrl ($scope, $modalInstance) {
                $scope.thename='编辑';
                $scope.modalform=row;
                //$scope.modalform.sponsor=[row.sponsor];
                $scope.modalform.sponsorarr=[[],[row.sponsor]];
                //[[],[row.userDTO]]
                //提交增加
                $scope.ok = function (state) {

                    if(!state){return;} //状态判断
                    changeRecruitPlanFun('MODIFY',$scope.modalform,$modalInstance,oldrow);
                };
                $scope.cancel = function () {
                    angular.copy(oldrow, row);
                    $modalInstance.dismiss('cancel');
                };
            };
        };
        //删除
        $scope.delete=function(row){
            Common.openConfirmWindow().then(function() {
                changeRecruitPlanFun('DELETE',row);
            });
        };

        /*===职位==*/
        //添加/修改/删除
        function changeRecruitPositionFun(change,row,$modalInstance,oldrow){
            if(oldrow==undefined){oldrow=row}
            var planOnboardDate=$filter('date')(row.planOnboardDate,'yyyy-MM-dd');
            if(change!='DELETE'){
                $scope.options={
                    "actionType":change,		//ADD, MODIFY, DELETE
                    "planName":row.planName || "",		//招聘计划名称
                    "positionName":oldrow.positionName || "",		//职位名称
                    "newPositionName":row.positionName || "",	//新职位名称
                    "positionRequirement":row.positionRequirement || "",	//职位要求
                    "positionDesc":row.positionDesc || "",		//职位描述
                    "positionCount":row.positionCount || "", 		//职位招聘人数
                    "planOnboardDate":planOnboardDate || "" 		//期望到岗时间
                }
            }else {
                $scope.options={
                    "actionType":change,		//ADD, MODIFY, DELETE
                    "planName":row.planName || "",		//招聘计划名称
                    "positionName":row.positionName || ""		//职位名称
                };
            }
            debugger;
            var promise = RecruitFlowService.changeRecruitPosition({body:$scope.options});
            promise.success(function(data, status, headers, config){
                var sts=data.body.status;
                if(sts.statusCode==0){
                    inquiryRecruitPlanFun();
                    $modalInstance.close();
                }else{
                    MsgService.tomsg(data.body.status.errorDesc);
                }
            });
            promise.error(function(data, status, headers, config){
                MsgService.tomsg(data.body.status.errorDesc);
            });
        }
        //新增
        $scope.addPositionFun = function (row) {
            var modalInstance = $modal.open({
                templateUrl: 'addPosition.html',
                //size:'sm',
                controller: modalCtrl
            });
            function modalCtrl ($scope, $modalInstance) {
                $scope.thename='新增';
                $scope.modalform={};
                $scope.modalform.planName=row.planName;
                //提交增加
                $scope.ok = function (state) {
                    if(!state){return;} //状态判断
                    changeRecruitPositionFun('ADD',$scope.modalform,$modalInstance);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        };
        //编辑
        $scope.editPositionFun = function (row,prow) {
            var oldrow=angular.copy(row);
            var modalInstance = $modal.open({
                templateUrl: 'addPosition.html',
                controller: modalCtrl
            });
            function modalCtrl ($scope, $modalInstance) {
                $scope.thename='编辑';
                $scope.modalform=row;
                $scope.modalform.planName=prow.planName;
                //[[],[row.userDTO]]
                //提交增加
                $scope.ok = function (state) {
                    if(!state){return;} //状态判断
                    changeRecruitPositionFun('MODIFY',$scope.modalform,$modalInstance,oldrow);
                };
                $scope.cancel = function () {
                    angular.copy(oldrow, row);
                    $modalInstance.dismiss('cancel');
                };
            };
        };
        //删除
        $scope.deletePosition=function(row,prow){
            Common.openConfirmWindow().then(function() {
                row.planName=prow.planName;
                changeRecruitPositionFun('DELETE',row);
            });
        };
    }]
}
//列表渠道管理
function channemsgllistCtrl(){
    return['$rootScope','$scope','$modal','RecruitFlowService','MsgService','LocalStorage','Common',function($rootScope,$scope,$modal,RecruitFlowService,MsgService,LocalStorage,Common){
        var userinfo=LocalStorage.getObject('userinfo');
        $scope.initFun = function(){
            inquiryRecruitChannelFun();
        };
        $scope.thispages={
            total:null,
            pageNum:1,
            pageSize:10
        };
        //查询list
        function inquiryRecruitChannelFun(){
            $scope.options={
                //"channelName":"",	//查询某个渠道列表
                //"companyName":""	//查询某个渠道, 都不传入则查询所有渠道
            };
            var promise = RecruitFlowService.inquiryRecruitChannel({body:$scope.options});
            promise.success(function(data, status, headers, config){
                var sts=data.body.status;
                if(sts.statusCode==0){
                    $scope.datalist=data.body.data.channels;
                    $scope.thispages.total=$scope.datalist.length;	//分页
                }else{
                    MsgService.tomsg(data.body.status.errorDesc);
                }
            });
            promise.error(function(data, status, headers, config){
                MsgService.tomsg(data.body.status.errorDesc);
            });
        }
        //添加/修改/删除
        function changeRecruitChannelFun(change,row,$modalInstance,oldrow){
            if(oldrow==undefined){oldrow=row}
            if(change!='DELETE'){
                $scope.options={
                    "actionType":change,		//ADD, MODIFY, DELETE
                    "channelName":row.channelName || "",		//渠道名称
                    "companyName":oldrow.companyName || "",		//公司名称
                    "newCompanyName":row.companyName || "",	//新公司名称
                    "companyWebsite":row.companyWebsite || "",	//公司网址
                    "contactName":row.contactName || "",		//联系人姓名
                    "contactMobileCountryCode":"86",	//联系人电话号码国家代码
                    "contactMobileNo":row.contactMobileNo || ""	//联系人电话号码
                }
            }else {
                $scope.options={
                    "actionType":change,		//ADD, MODIFY, DELETE
                    "channelName":row.channelName		//渠道名称
                };
            }
            debugger;
            var promise = RecruitFlowService.changeRecruitChannel({body:$scope.options});
            promise.success(function(data, status, headers, config){
                var sts=data.body.status;
                if(sts.statusCode==0){
                    inquiryRecruitChannelFun();
                    $modalInstance.close();
                }else{
                    MsgService.tomsg(data.body.status.errorDesc);
                }
            });
            promise.error(function(data, status, headers, config){
                MsgService.tomsg(data.body.status.errorDesc);
            });
        }
        //新增
        $scope.addmodelFun = function () {
            var modalInstance = $modal.open({
                templateUrl: 'addmodel.html',
                //size:'sm',
                controller: modalCtrl
            });
            function modalCtrl ($scope, $modalInstance) {
                $scope.thename='新增';
                $scope.modalform={};
                //提交增加
                $scope.ok = function (state) {
                    if(!state){return;} //状态判断
                    changeRecruitChannelFun('ADD',$scope.modalform,$modalInstance);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        };
        //编辑
        $scope.editFun = function (row) {
            var oldrow=angular.copy(row);
            var modalInstance = $modal.open({
                templateUrl: 'addmodel.html',
                controller: modalCtrl
            });
            function modalCtrl ($scope, $modalInstance) {
                $scope.thename='编辑';
                $scope.modalform=row;
                //[[],[row.userDTO]]
                //提交增加
                $scope.ok = function (state) {
                    if(!state){return;} //状态判断
                    changeRecruitChannelFun('MODIFY',$scope.modalform,$modalInstance,oldrow);
                };
                $scope.cancel = function () {
                    angular.copy(oldrow, row);
                    $modalInstance.dismiss('cancel');
                };
            };
        };
        //删除
        $scope.delete=function(row){
            Common.openConfirmWindow().then(function() {
                changeRecruitChannelFun('DELETE',row);
            });
        };
    }]
}
//列表招聘过程
function processmsglistCtrl(){
    return['$rootScope','$scope','$modal','RecruitFlowService','MsgService','LocalStorage','Common',function($rootScope,$scope,$modal,RecruitFlowService,MsgService,LocalStorage,Common){
        var userinfo=LocalStorage.getObject('userinfo');
        $scope.initFun = function(){
            inquiryRecruitFlowFun();
        };
        $scope.thispages={
            total:null,
            pageNum:1,
            pageSize:10
        };
        //查询list
        function inquiryRecruitFlowFun(){
            $scope.options={};
            var promise = RecruitFlowService.inquiryRecruitFlow({body:$scope.options});
            promise.success(function(data, status, headers, config){
                var sts=data.body.status;
                if(sts.statusCode==0){
                    $scope.datalist=data.body.data.flows[0].recruitFlowNodeDTOList;
                    $scope.thispages.total=$scope.datalist.length;	//分页
                }else{
                    MsgService.tomsg(data.body.status.errorDesc);
                }
            });
            promise.error(function(data, status, headers, config){
                MsgService.tomsg(data.body.status.errorDesc);
            });
        }
        //添加/修改/删除
        function changeRecruitFlowFun(change,row,$modalInstance,oldrow,prow){
            if(oldrow==undefined){oldrow=row}
            if(change=='ADD'){
                var datalist=$scope.datalist || [];
                datalist.push({	//流程节点列表
                    "flowName":"默认招聘流程",	//节点名称
                    "flowNodeName":row.flowNodeName || "",	//新节点名称
                    "flowNodeSequence":$scope.thispages.total+1 || "" 	//节点序列号
                });
                $scope.options={
                    "actionType":change,		//ADD, MODIFY, DELETE
                    "recruitFlowNodeDTOList":datalist
                }
            }else if(change=='MODIFY'){
                angular.forEach(prow,function(val,ind){
                    prow.flowName="默认招聘流程";	//节点名称
                    if(ind==row.flowNodeSequence-1){
                        prow.flowNodeName=row.flowNodeName;
                    }
                });
                $scope.options={
                    "actionType":change,		//ADD, MODIFY, DELETE
                    "recruitFlowNodeDTOList":prow || ""		//流程名称
                };
            }else{
                row.recruitFlowNodeDTOList.splice(row.flowNodeSequence-1, 1);
                angular.forEach(row.recruitFlowNodeDTOList,function(val,ind){
                    val.flowName="默认招聘流程";	//节点名称
                    val.flowNodeSequence=ind+1
                });
                $scope.options={
                    "actionType":change,		//ADD, MODIFY, DELETE
                    "recruitFlowNodeDTOList":row.recruitFlowNodeDTOList || ""		//流程名称
                };
            }
            var promise = RecruitFlowService.changeRecruitFlow({body:$scope.options});
            promise.success(function(data, status, headers, config){
                var sts=data.body.status;
                if(sts.statusCode==0){
                    inquiryRecruitFlowFun();
                    $modalInstance.close();
                }else{
                    MsgService.tomsg(data.body.status.errorDesc);
                }
            });
            promise.error(function(data, status, headers, config){
                MsgService.tomsg(data.body.status.errorDesc);
            });
        }
        //新增
        $scope.addmodelFun = function () {
            var modalInstance = $modal.open({
                templateUrl: 'addmodel.html',
                //size:'sm',
                controller: modalCtrl
            });
            function modalCtrl ($scope, $modalInstance) {
                $scope.thename='新增';
                $scope.modalform={};
                //提交增加
                $scope.ok = function (state) {
                    if(!state){return;} //状态判断
                    changeRecruitFlowFun('ADD',$scope.modalform,$modalInstance);
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        };
        //编辑
        $scope.editFun = function (row,prow) {
            var oldrow=angular.copy(row);
            var modalInstance = $modal.open({
                templateUrl: 'addmodel.html',
                controller: modalCtrl
            });
            function modalCtrl ($scope, $modalInstance) {
                $scope.thename='编辑';
                $scope.modalform=row;
                //[[],[row.userDTO]]
                //提交增加
                $scope.ok = function (state) {
                    if(!state){return;} //状态判断
                    changeRecruitFlowFun('MODIFY',$scope.modalform,$modalInstance,oldrow,prow);
                };
                $scope.cancel = function () {
                    angular.copy(oldrow, row);
                    $modalInstance.dismiss('cancel');
                };
            };
        };
        //删除
        $scope.delete=function(row,prow){
            row.recruitFlowNodeDTOList=prow;
            Common.openConfirmWindow().then(function() {
                changeRecruitFlowFun('DELETE',row);
            });
        };
    }]
}
//列表
/*
function classlistreCtrl(){
    return['$rootScope','$scope','$modal','attendanceService','MsgService','LocalStorage','Common',function($rootScope,$scope,$modal,attendanceService,MsgService,LocalStorage,Common){
        var userinfo=LocalStorage.getObject('userinfo');
        $scope.initFun = function(){
            inquiryAttendanceFun();
        };
        $scope.thispages={
            total:null,
            pageNum:1,
            pageSize:10
        };
        //查询考勤记录当月
        function inquiryAttendanceFun(){
            $scope.options={
                "attendanceYear":attendance.attendanceYear,	//签到或签退年份
                "attendanceMonth":attendance.attendanceMonth,	//签到或签退月份
                "attendanceDay":""		//签到或签退天
            };
            var promise = attendanceService.inquiryAttendance({body:$scope.options});
            promise.success(function(data, status, headers, config){
                var sts=data.body.status;
                if(sts.statusCode==0){
                    $scope.attendanceslist=data.body.data.attendances;
                    $scope.thispages.total=$scope.attendanceslist.length;	//分页
                }else{
                    MsgService.tomsg(data.body.status.errorDesc);
                }
            });
            promise.error(function(data, status, headers, config){
                MsgService.tomsg(data.body.status.errorDesc);
            });
        }

        //新增
        $scope.addmodelFun = function () {
            var modalInstance = $modal.open({
                templateUrl: 'addmodel.html',
                //size:'sm',
                controller: modalCtrl
            });
            function modalCtrl ($scope, $modalInstance) {
                $scope.thename='新增';
                //提交增加
                $scope.ok = function (state) {
                    if(!state){return;} //状态判断
                    //$modalInstance.close();
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        };
        //编辑社保
        $scope.editmodelFun = function () {
            var modalInstance = $modal.open({
                templateUrl: 'addmodel.html',
                //size:'sm',
                controller: modalCtrl
            });
            function modalCtrl ($scope, $modalInstance) {
                $scope.thename='编辑';
                //提交增加
                $scope.ok = function (state) {
                    if(!state){return;} //状态判断
                    //$modalInstance.close();
                };
                $scope.cancel = function () {
                    $modalInstance.dismiss('cancel');
                };
            };
        };

        //批量
        $scope.delete2=function(row){
            Common.openConfirmWindow().then(function() {
                changeshebaoFun('DELETE',row);
            });
        };

        //批量删除
        $scope.deleteAll=function(){
            Common.openConfirmWindow().then(function() {
                deleteAllEmployees();
            });
        };
        function deleteAllsx(){
            var datalist = $scope.datalist;
            angular.forEach(datalist, function(item) {
                if (item.checked == true) {
                    selectedItems.push({"userUuid":item.userUuid});
                }
            });
            $scope.options={
                userList:selectedItems
            };
            var promise = employeesService.deleteEmployees({body:$scope.options});
            promise.success(function(data, status, headers, config){
                var sts=data.body.status;
                if(sts.statusCode==0){
                    inquiryEmployeeFun();
                }else{
                    MsgService.tomsg(data.body.status.errorDesc);
                }
            });
            promise.error(function(data, status, headers, config){
                MsgService.tomsg(data.body.status.errorDesc);
            });
        }


    }]
}*/
