<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 日志表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <div class="block">
                    <el-date-picker v-model="value1" align="right" type="date" placeholder="选择日期" :picker-options="pickerOptions"></el-date-picker>
                    <span class="el-icon-d-arrow-right"></span>
                    <el-date-picker v-model="value2" type="date" placeholder="选择日期"> </el-date-picker>
                    <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
                </div>
            </div>
            <el-table
                :data="tableData"
                border
                class="table"
                ref="multipleTable"
                header-cell-class-name="table-header"
                @selection-change="handleSelectionChange"
            >
                <el-table-column type="selection" width="55" align="center"></el-table-column>
                <el-table-column prop="logId" label="日志ID" width="65" align="center"></el-table-column>
                <el-table-column prop="logDate" label="日期"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">{{ scope.row.logType }}</template>
                </el-table-column>
                <el-table-column prop="courseId" label="操作对象"></el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination
                    background
                    layout="total, prev, pager, next"
                    :current-page="query.pageIndex"
                    :page-size="query.pageSize"
                    :total="pageTotal"
                    @current-change="handlePageChange"
                ></el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
import { fetch_log } from '../../api/index';
import Axios from 'axios';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                from: '',
                to: '',
                pageIndex: 1,
                pageSize: 10
            },
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() > Date.now();
                },
                shortcuts: [
                    {
                        text: '今天',
                        onClick(picker) {
                            picker.$emit('pick', new Date());
                        }
                    },
                    {
                        text: '昨天',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24);
                            picker.$emit('pick', date);
                        }
                    },
                    {
                        text: '一周前',
                        onClick(picker) {
                            const date = new Date();
                            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                            picker.$emit('pick', date);
                        }
                    }
                ]
            },
            value1: '',
            value2: '',
            value_class: '',
            value_major: '',
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: {},
            form_add: {},
            origin: {},
            idx: -1,
            id: -1
        };
    },
    created() {
        this.getData();
    },
    methods: {
        // 获取 easy-mock 的模拟数据
        getData() {
            this.query.from = this.value1==''? new Date():this.value1;
            this.query.to = this.value2==''? new Date():this.value2;
            console.log("tototototo",this.query.to)
            fetch_log(this.query).then(res => {
                console.log(this.query);
                // console.log('this.res===:');
                console.log(res);
                // console.log('Test Date', new Date().getFullYear() + '-' + new Date().getMonth() + '-' + new Date().getDate());
                // console.log('Test Date', this.value2.split(' '));
                this.tableData = res.data.data;
                this.pageTotal = res.data.pagetotal || 10;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 分页导航
        handlePageChange(val) {
            this.$set(this.query, 'pageIndex', val);
            this.getData();
        }
    }
};
</script>

<style scoped>
.handle-box {
    margin-bottom: 20px;
}

.handle-select {
    width: 120px;
}

.handle-input {
    width: 300px;
    display: inline-block;
}
.table {
    width: 100%;
    font-size: 14px;
}
.red {
    color: #ff0000;
}
.mr10 {
    margin-right: 10px;
}
.table-td-thumb {
    display: block;
    margin: auto;
    width: 40px;
    height: 40px;
}
</style>
