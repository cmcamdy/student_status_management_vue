<template>
    <div>
        <div class="crumbs">
            <el-breadcrumb separator="/">
                <el-breadcrumb-item> <i class="el-icon-lx-cascades"></i> 学籍管理 </el-breadcrumb-item>
            </el-breadcrumb>
        </div>
        <div class="container">
            <div class="handle-box">
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
                <el-table-column prop="required" label="必修学分"></el-table-column>
                <el-table-column prop="elective" label="选修学分"></el-table-column>
                <el-table-column prop="statusStr" label="学籍状态"></el-table-column>

                <el-table-column label="操作" width="250" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" icon="el-icon-edit" @click="handleGraduate(scope.$index, scope.row)">毕业</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleRecover(scope.$index, scope.row)">复学</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleSuspen(scope.$index, scope.row)">休学</el-button>
                        <el-button type="text" icon="el-icon-edit" @click="handleExit(scope.$index, scope.row)">退学</el-button>
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

        <!-- 毕业弹出框 -->
        <el-dialog title="毕业" :visible.sync="graduateVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="学号">
                    <el-input v-model="form.sid" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="学生姓名">
                    <el-input v-model="form.name"  :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="班级">
                    <el-input v-model="form.class" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="必修学分">
                    <el-input v-model="form.required" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="选修学分">
                    <el-input v-model="form.elective" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <H3 style="color:#67C23A">请确认该学生是否可以毕业？</H3>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveGraduate">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 复学弹出框 -->
        <el-dialog title="复学" :visible.sync="recoverVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="学号">
                    <el-input v-model="form.sid" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="学生姓名">
                    <el-input v-model="form.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="班级">
                    <el-input v-model="form.class" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <H3 style="color:#67C23A">请确认该学生是否复学？</H3>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="suspenVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveRecover">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 休学弹出框 -->
        <el-dialog title="休学" :visible.sync="suspenVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="学号">
                    <el-input v-model="form.sid" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="学生姓名">
                    <el-input v-model="form.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="班级">
                    <el-input v-model="form.class" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <H3 style="color:#F56C6C">请确认该学生是否休学？</H3>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="suspenVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveSuspen">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 退学弹出框 -->
        <el-dialog title="退学" :visible.sync="exitVisible" width="30%">
            <el-form ref="form" :model="form" label-width="70px">
                <el-form-item label="学号">
                    <el-input v-model="form.sid" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="学生姓名">
                    <el-input v-model="form.name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="班级">
                    <el-input v-model="form.class" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="">
                    <H3 style="color:#F56C6C">请确认该学生是否退学？</H3>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="exitVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveExit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { fetch_data_with_credit, update_status, fetch_major } from '../../api/index';
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
            major: {},
            value_class: '',
            value_major: '',
            tableData: [],
            multipleSelection: [],
            delList: [],
            editVisible: false,
            graduateVisible: false,
            recoverVisible: false,
            suspenVisible: false,
            exitVisible: false,
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
        this.getMajor();
    },
    methods: {
        getMajor() {
            fetch_major().then(res => {
                // console.log(res.data);
                this.major = res.data;
            });
        },
        getData() {
            fetch_data_with_credit(this.query).then(res => {
                // console.log(this.query);
                // console.log('this.res===:');
                // console.log(res);
                this.tableData = res.data.data;
                for (let i = 0; i < this.tableData.length; i++) {
                    // console.log(this.tableData[i])
                    if (this.tableData[i].status == 1) this.tableData[i].statusStr = '已入学';
                    if (this.tableData[i].status == 2) this.tableData[i].statusStr = '已毕业';
                    if (this.tableData[i].status == 3) this.tableData[i].statusStr = '休学中';
                    if (this.tableData[i].status == 4) this.tableData[i].statusStr = '已退学';
                    if (!this.tableData[i].required) this.tableData[i].required = 0;
                    if (!this.tableData[i].elective) this.tableData[i].elective = 0;
                    // console.log(this.tableData[i])
                }
                this.pageTotal = res.data.pagetotal || 10;
            });
        },
        // 触发搜索按钮
        handleSearch() {
            this.$set(this.query, 'pageIndex', 1);
            this.getData();
        },
        // 多选操作
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        // 毕业操作
        handleGraduate(index, row) {
            this.idx = index;
            this.form = row;
            // console.log(this.form.class);
            // console.log(this.form.class.substring(0,this.form.class.length-3));
            // console.log(this.major[this.form.class.substring(0,this.form.class.length-3)])
            let maj = this.major[this.form.class.substring(0, this.form.class.length - 3)];

            if (row.statusStr != '已入学') {
                this.$message.error('当前未在入学状态，不能毕业');
            } else if (maj.required > this.form.required || maj.electives > this.form.electives) {
                this.$message.error('当前学分不足，不能毕业');
            } else {
                this.graduateVisible = true;
            }
        },
        handleRecover(index, row) {
            if (row.statusStr == '休学中') {
                this.form = row;
                this.idx = index;
                this.recoverVisible = true;
            } else {
                this.$message.error('当前学生不是休学状态，不能复学');
            }
        },
        handleSuspen(index, row) {
            if (row.statusStr == '已入学') {
                this.form = row;
                this.idx = index;
                this.suspenVisible = true;
            } else {
                this.$message.error('当前学生不是入学状态，不能休学');
            }
        },
        handleExit(index, row) {
            if (row.statusStr != '已毕业') {
                this.form = row;
                this.idx = index;
                this.exitVisible = true;
            } else {
                this.$message.error('当前学生已经毕业，不能退学');
            }
        },saveGraduate(){
            this.form.status = 2;
            this.form.statusStr = '已毕业';
            update_status(this.form).then(res => {
                console.log(res);
                this.getData();
            });
            this.graduateVisible = false;
            this.$message.success(`毕业处理成功`);
        },
        saveRecover() {
            this.form.status = 1;
            this.form.statusStr = '已入学';
            update_status(this.form).then(res => {
                console.log(res);
                this.getData();
            });
            this.recoverVisible = false;
            this.$message.success(`复学处理成功`);
        },
        saveSuspen() {
            // console.log(this.form)
            this.form.status = 3;
            this.form.statusStr = '休学中';
            update_status(this.form).then(res => {
                console.log(res);
                this.getData();
            });
            this.suspenVisible = false;
            this.$message.warning(`休学处理成功`);
        },
        saveExit() {
            this.form.status = 4;
            this.form.statusStr = '已退学';
            update_status(this.form).then(res => {
                console.log(res);
                this.getData();
            });
            this.exitVisible = false;
            this.$message.warning(`退学处理成功`);
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
