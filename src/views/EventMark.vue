<template>
  <div>
    <div
      class="text-wrapper"
      @mouseup="up"
      ref="textarea"
      v-html="content"
    ></div>
    <el-dialog
      title="新增标记"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="选择文本：" ref="content" prop="content">
          <el-input type="textarea" v-html="selectContent" autosize></el-input>
        </el-form-item>
        <el-form-item label="事件类型：" prop="eventType">
          <el-select
            v-model="form.eventType"
            placeholder="请选择事件类型"
            @change="changeEventTypeSelect"
          >
            <el-option
              v-for="item in eventOptions"
              :key="item.event_type"
              :label="item.event_type_chinese"
              :value="item.event_type"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="触发词：" prop="trigger">
          <el-select v-model="form.trigger" placeholder="请选择触发词">
            <el-option
              v-for="item in triggerOptions"
              :key="item"
              :label="item"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="事件要素：" prop="argument">
          <el-select v-model="form.argument" placeholder="请选择事件要素">
            <el-option
              v-for="item in argumentsOptions"
              :key="item.role"
              :label="item.role_chinese"
              :value="item.role"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveData">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="预览JSON"
      :visible.sync="centerDialogVisible"
      width="80%"
      center
    >
      <el-input type="textarea" v-model="jsonContent" autosize></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="centerDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="centerDialogVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <br /><br />
    <el-button>标注数据</el-button>
    <el-button type="success" plain @click="showJSON">预览JSON</el-button>
    <el-table :data="tableData" style="width: 100%" border="">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-row
              v-for="argumentSet in props.row.arguments"
              :key="argumentSet.argument_start_index"
            >
              <el-col :span="8">
                <el-form-item
                  label="argument_start_index:"
                  style="text-align: center"
                >
                  <span>{{ argumentSet.argument_start_index }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="role:" style="text-align: center">
                  <span>{{ argumentSet.role }}</span>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item label="argument:" style="text-align: center">
                  <span>{{ argumentSet.argument }}</span>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column label="event_type" prop="event_type"> </el-table-column>
      <el-table-column label="trigger" prop="trigger"> </el-table-column>
      <el-table-column label="trigger_start_index" prop="trigger_start_index">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import eventMeta from "@/assets/event-meta.json";

export default {
  name: "EventMark",
  data() {
    return {
      form: {
        eventType: "",
        argument: "",
      },
      content: null, // 文本内容
      eventType: null, // 事件类型
      trigger: null, // 触发词
      chooseSea: {
        width: "120px",
        height: "40px",
        background: "rgba(255, 255, 255, 1)",
        border: "1px solid rgba(57, 139, 247, 1)",
        lineHeight: "38px",
        position: "fixed",
        display: "none",
        paddingLeft: "20px",
        boxSizing: "border-box",
        left: "327",
        top: "100",
      },
      dialogVisible: false, //Dialog
      centerDialogVisible: false,
      selectContent: "",
      eventOptions: [],
      triggerOptions: [],
      argumentsOptions: [], // 事件要素元数据,
      rules: {
        content: [
          { required: true, message: "请输入文本内容", trigger: "blur" },
        ],
        eventType: [
          { required: true, message: "请选择事件类型", trigger: "blur" },
        ],
        trigger: [{ required: true, message: "请选择触发词", trigger: "blur" }],
      },
      tableData: [],
      jsonData: {
        text: "",
        id: 0,
        event_list: [],
      },
      jsonContent: "",
    };
  },
  created() {
    this.eventOptions = eventMeta;
    let textContent = this.$route.params.content;
    let html = "<div>";
    for (let index = 0; index < textContent.length; index++) {
      html += "<w num=" + index + ">" + textContent[index] + "</w>";
    }
    html += "</div>";
    this.content = html;
    console.log(this.content);
    console.log(this.eventType);
    console.log(this.trigger);
    console.log(this.arguments);
  },
  methods: {
    up() {
      let selectHtml = this.getSelectionHtml();
      console.log(selectHtml);
      this.selectContent = selectHtml;
      if (selectHtml !== "") {
        this.dialogVisible = true;
        this.form.argument = "";
      } else {
        this.chooseSea.display = "none";
        this.selectContent = "";
      }
    },
    getSelectionHtml() {
      let html = "";
      if (typeof window.getSelection != "undefined") {
        let sel = window.getSelection();
        if (sel.rangeCount) {
          let container = document.createElement("div");
          for (let i = 0, len = sel.rangeCount; i < len; ++i) {
            container.appendChild(sel.getRangeAt(i).cloneContents());
          }
          html = container.innerHTML;
        }
      } else if (typeof document.selection != "undefined") {
        if (document.selection.type == "Text") {
          html = document.selection.createRange().htmlText;
        }
      }
      console.log(html);
      return html;
    },
    showDialog() {
      this.dialogVisible = true;
    },
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then((_) => {
          done();
          console.log(_);
          this.chooseSea.display = "none";
        })
        .catch((_) => {
          console.log(_);
        });
    },
    changeEventTypeSelect: function (selectValue) {
      eventMeta.forEach((element) => {
        if (element.event_type === selectValue) {
          this.triggerOptions = element.triggers;
          this.argumentsOptions = element.arguments;
          console.log(this.argumentsOptions);
        }
      });
    },
    saveData() {
      this.dialogVisible = false;
      //获取索引
      let index = this.getIndex();
      if (index === undefined) {
        this.$message.error("索引获取异常");
        return;
      }
      //获取事件英文名字
      console.log(index);
      //选择触发事件
      if (this.form.argument === "") {
        let eventData = {
          event_type: this.form.eventType,
          trigger: this.toText(this.selectContent),
          trigger_start_index: parseInt(index),
          arguments: [],
        };
        this.tableData.push(eventData);
      }
      //选择事件要素，默认选择的是最后一个事件
      else {
        let argumentData = {
          argument_start_index: parseInt(index),
          role: this.form.argument,
          argument: this.toText(this.selectContent),
          alias: [],
        };
        this.tableData[this.tableData.length - 1].arguments.push(argumentData);
      }
    },
    getIndex() {
      // eslint-disable-next-line no-useless-escape
      let str = /(?<=\<w num=\").*?(?=\")/;
      let nums = str.exec(this.selectContent);
      if (nums.length > 0) {
        return nums[0];
      }
      console.log(nums);
    },
    toText(html) {
      let input = html;
      return input
        .replace(/<(style|script|iframe)[^>]*?>[\s\S]+?<\/\1\s*>/gi, "")
        .replace(/<[^>]+?>/g, "")
        .replace(/\s+/g, " ")
        .replace(/ /g, " ")
        .replace(/>/g, " ");
    },
    showJSON() {
      if (this.tableData.length === 0) {
        this.$message.error("表格数据不能为空！");
        return false;
      }
      this.centerDialogVisible = true;
      this.jsonContent = "";
      this.jsonData.text = this.toText(this.content);
      this.jsonData.event_list = this.tableData;
      let jsonStr = JSON.stringify(this.jsonData);
      console.log(jsonStr);
      this, (this.jsonContent = jsonStr);
    },
    deleteRow(index, rows) {
      rows.splice(index, 1);
    },
  },
};
</script>
<style scoped>
.text-wrapper {
  white-space: pre-wrap;
}
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
}
</style>