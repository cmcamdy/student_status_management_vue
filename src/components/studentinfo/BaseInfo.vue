<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 学生基本信息表 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
                <el-button type="primary" icon="el-icon-lx-roundadd" class="handle-del mr10" @click="addStudent()">新增学生</el-button>
                <el-select v-model="query.major" placeholder="专业" class="handle-select mr10">
                    <el-option key="1" label="计算机科学与技术" value="计算机科学与技术"></el-option>
                    <el-option key="2" label="数字媒体" value="数字媒体"></el-option>
                </el-select>
                <el-input v-model="query.name" placeholder="学生姓名" class="handle-input mr10"></el-input>
                <el-button type="primary" icon="el-icon-search" @click="handleSearch">搜索</el-button>
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
                <el-table-column prop="sid" label="学号" width="55" align="center"></el-table-column>
                <el-table-column prop="name" label="姓名"></el-table-column>
                <el-table-column label="班级">
                    <template slot-scope="scope">{{ scope.row.class }}</template>
                </el-table-column>
                <el-table-column prop="address" label="地址"></el-table-column>
                <el-table-column prop="other" label="其他信息"></el-table-column>

                <el-table-column label="操作" width="180" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    </template>
                </el-table-column>
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

        <!-- 编辑弹出框 -->
        <el-dialog title="编辑" :visible.sync="editVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="学号">
                    <el-input v-model="form.sid" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="学生姓名">
                    <el-input v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="班级">
                    <el-input v-model="form.class" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="地址">
                    <el-input v-model="form.address"></el-input>
                </el-form-item>
                <el-form-item label="其他信息">
                    <el-input v-model="form.other"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveEdit">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 添加学生框 -->
        <el-dialog title="新增学生" :visible.sync="addVisible" width="30%">
            <el-form ref="form" :model="form_add" label-width="70px">
                <el-form-item label="学生姓名">
                    <el-input v-model="form_add.name" placeholder="请输入学生姓名"></el-input>
                </el-form-item>

                <el-form-item label="专业">
                    <el-select v-model="form_add.major" placeholder="请选择专业">
                        <el-option v-for="major in options_major" :key="major.value" :label="major.label" :value="major.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班级">
                    <el-select v-model="form_add.class" placeholder="请选择班级">
                        <el-option v-for="_class in options_class" :key="_class.value" :label="_class.label" :value="_class.value"> </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="地址" >
                    <el-input v-model="form_add.address" placeholder="请输入学生户籍所在地"></el-input>
                </el-form-item>
                <el-form-item label="身份证号" >
                    <el-input v-model="form_add.idnum" placeholder="请输入学生身份证号"></el-input>
                </el-form-item>
                <el-form-item label="其他信息" >
                    <el-input v-model="form_add.other" placeholder="请输入其他信息，包括备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveAdd">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetch_student, update_student_info ,add_student} from '../../api/index';
import Axios from 'axios';
export default {
    name: 'basetable',
    data() {
        return {
            query: {
                major: '',
                name: '',
                pageIndex: 1,
                pageSize: 10
            },
            options_class: [
                {
                    value: '1',
                    label: '1'
                },
                {
                    value: '2',
                    label: '2'
                },
                {
                    value: '3',
                    label: '3'
                }
            ],
            options_major: [
                {
                    value: '计算机科学与技术',
                    label: '计算机科学与技术'
                },
                {
                    value: '数字媒体',
                    label: '数字媒体'
                }
            ],
            value_class: '',
            value_major: '',
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            addVisible: false,
            pageTotal: 0,
            form: {},
            form_add:{},
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
            fetch_student(this.query).then(res => {
                // console.log(this.query);
                // console.log('this.res===:');
                console.log(res);
                this.tableData = res.data.data;
                this.pageTotal = res.data.pagetotal || 10;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        addStudent(){
            this.form_add={};
            this.addVisible = true;
        },saveAdd(){

            // this.$set(this.tableData, this.idx, this.form);
            // console.log(this.form_add);
            let data = this.form_add
            data['pageIndex']= this.query.pageIndex;
            data['pageSize'] = this.query.pageSize;
            add_student(data).then(res => {
                console.log(data);
                console.log("this.res:",res);
                this.tableData = res.data.data;
                this.pageTotal = res.data.pagetotal || 10;
            });
            // console.log(this.options_class);
            // console.log(this.options_major);
            this.addVisible = false;
        },

        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 编辑操作
        handleEdit(index, row) {
            this.idx = index;
            this.form = row;
            this.origin['sid'] = row['sid'];
            this.origin['name'] = row['name'];
            this.origin['class'] = row['class'];
            this.origin['address'] = row['address'];
            this.origin['other'] = row['other'];
            this.editVisible = true;
        },
        // 保存编辑
        saveEdit() {
            this.editVisible = false;
            this.$message.success(`修改第 ${this.idx + 1} 行成功`);

            this.$set(this.tableData, this.idx, this.form);
            // console.log(this.form);
            // console.log("this.row:",this.row);
            // console.log("this.origin:",this.origin);
            let data = {};
            data['sid'] = this.form['sid'];
            if (this.form['name'] != this.origin['name']) data['name'] = this.form['name'];
            if (this.form['class'] != this.origin['class']) data['class'] = this.form['class'];
            if (this.form['address'] != this.origin['address']) data['address'] = this.form['address'];
            if (this.form['other'] != this.origin['other']) data['other'] = this.form['other'];
            data['pageIndex']= this.query.pageIndex;
            data['pageSize'] = this.query.pageSize;
            update_student_info(data).then(res => {
                console.log(res);
            });
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
