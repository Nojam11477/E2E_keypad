import java.awt.Desktop
import java.io.File
import java.io.IOException

fun fileopen(){
    // 현재 작업 디렉토리를 기준으로 특정 파일 경로를 결합합니다.
    val currentDir = System.getProperty("user.dir")
    // 현재 작업 디렉토리를 기준으로 특정 파일 경로를 결합합니다.
    val targetFilePath = "$currentDir/src/main/kotlin/index.html"
    // 파일 경로를 사용하여 File 객체를 생성합니다.
    val file = File(targetFilePath)

    // 파일 경로를 출력합니다.
    println("파일 경로: ${file.absolutePath}")

    // 파일이 존재하는지 확인합니다.
    if (file.exists()) {
        // 데스크탑 객체를 가져옵니다.
        val desktop = Desktop.getDesktop()

        try {
            // 브라우저에서 파일을 엽니다.
            desktop.browse(file.toURI())
            println("index.html 파일을 브라우저에서 열었습니다.")
        } catch (e: IOException) {
            e.printStackTrace()
            println("파일을 여는 도중 오류가 발생했습니다.")
        }
    } else {
        println("index.html 파일을 찾을 수 없습니다.")
    }
}


fun main() {
    fileopen()
}
